import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { quizAttemptSchema } from '@/lib/validation/user.schema';

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params;
    const { moduleId } = resolvedParams;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate body
    const body = await req.json();
    if (!Array.isArray(body)) {
        return NextResponse.json({ error: 'Expected array of answers' }, { status: 400 });
    }

    // Verify enrollment & Get quizzes
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: {
        id: true,
        order: true,
        quizPassMark: true,
        subject: { select: { course: { select: { id: true } } } },
        quizzes: { select: { id: true, correct: true, explanation: true } }
      }
    });

    if (!module || !module.subject || !module.subject.course) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const courseId = module.subject.course.id;

    // Parallelize pre-checks
    const [enrollment, batchAccess, maxExamAttempt] = await Promise.all([
      prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } }
      }),
      prisma.batchCourse.findFirst({
        where: {
          courseId,
          batch: {
            students: { some: { userId: user.id } },
            status: { in: ['ACTIVE', 'ENROLLING'] }
          }
        },
        select: { id: true } // optimization
      }),
      prisma.moduleQuizSession.aggregate({
        where: { userId: user.id, moduleId },
        _max: { attemptNum: true }
      })
    ]);

    if ((!enrollment || enrollment.status !== 'ACTIVE') && !batchAccess) {
      return NextResponse.json({ error: 'Not actively enrolled' }, { status: 403 });
    }

    const currentExamAttemptNum = (maxExamAttempt._max.attemptNum || 0) + 1;

    let score = 0;
    const results = [];
    const answersToSave = [];

    // O(1) Quiz Lookup Map
    const quizMap = new Map(module.quizzes.map(q => [q.id, q]));

    // Evaluate answers
    for (const item of body) {
      const { quizId, answer } = item;
      const parsed = quizAttemptSchema.safeParse({ answer });
      if (!parsed.success) continue;

      const quiz = quizMap.get(quizId);
      if (!quiz) continue;

      const passed = quiz.correct === answer;
      if (passed) score++;

      results.push({
        quizId,
        passed,
        correctAnswer: quiz.correct,
        explanation: quiz.explanation
      });

      answersToSave.push({
        quizId,
        answer,
        correct: passed
      });
    }

    const totalQuestions = body.length; // Evaluate against the questions answered (which is displayCount)
    const passMark = module.quizPassMark || 8;
    const passedModule = score >= passMark;

    // Record session
    await prisma.moduleQuizSession.create({
      data: {
        userId: user.id,
        moduleId,
        attemptNum: currentExamAttemptNum,
        score,
        total: totalQuestions,
        passed: passedModule,
        answers: answersToSave
      }
    });

    let nextModuleId = null;

    if (passedModule) {
      const [, , nextMod] = await Promise.all([
        prisma.moduleCompletion.upsert({
          where: { userId_moduleId: { userId: user.id, moduleId } },
          update: {},
          create: { userId: user.id, moduleId }
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { totalPoints: { increment: 50 } }
        }),
        prisma.module.findFirst({
          where: { 
            subject: { courseId: courseId }, 
            order: { gt: module.order }
          },
          orderBy: { order: 'asc' },
          select: { id: true }
        })
      ]);
      nextModuleId = nextMod?.id;
    } else {
      const nextMod = await prisma.module.findFirst({
        where: { 
          subject: { courseId: courseId }, 
          order: { gt: module.order }
        },
        orderBy: { order: 'asc' },
        select: { id: true }
      });
      nextModuleId = nextMod?.id;
    }

    return NextResponse.json({ 
      success: true, 
      score,
      totalQuestions,
      passMark,
      passedModule,
      results,
      nextModuleId
    });

  } catch (error) {
    console.error('[QUIZ_ATTEMPT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
