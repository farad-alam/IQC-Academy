import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { quizAttemptSchema } from '@/lib/validation/user.schema';

export async function POST(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: courseId } = resolvedParams;
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected array of answers' }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { finalExamQuizzes: true }
    });

    if (!course || !course.finalExamEnabled) {
      return NextResponse.json({ error: 'Final exam not available' }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } }
    });

    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Not actively enrolled' }, { status: 403 });
    }

    const maxExamAttempt = await prisma.finalExamSession.aggregate({
      where: { userId: user.id, courseId },
      _max: { attemptNum: true }
    });
    
    const currentExamAttemptNum = (maxExamAttempt._max.attemptNum || 0) + 1;

    let score = 0;
    const results = [];
    const answersToSave = [];

    // Evaluate answers
    for (const item of body) {
      const { quizId, answer } = item;
      const parsed = quizAttemptSchema.safeParse({ answer });
      if (!parsed.success) continue;

      const quiz = course.finalExamQuizzes.find(q => q.id === quizId);
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

    const totalQuestions = body.length;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    const passMark = course.finalExamPassMark || 80;
    const passedExam = percentage >= passMark;

    // Record session
    await prisma.finalExamSession.create({
      data: {
        userId: user.id,
        courseId,
        attemptNum: currentExamAttemptNum,
        score,
        total: totalQuestions,
        passed: passedExam,
        answers: answersToSave
      }
    });

    // If passed, mark enrollment as completed and add points
    if (passedExam) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { status: 'COMPLETED', completedAt: new Date(), progress: 100 }
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { totalPoints: { increment: 200 } } // Bonus for course completion
      });
    }

    return NextResponse.json({ 
      success: true, 
      score,
      totalQuestions,
      percentage,
      passMark,
      passedExam,
      results 
    });

  } catch (error) {
    console.error('[FINAL_EXAM_ATTEMPT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
