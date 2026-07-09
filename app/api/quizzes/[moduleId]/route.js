import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function GET(req, { params }) {
  try {
    const { moduleId } = params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify module and enrollment
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true }
    });

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId: module.courseId }
      }
    });

    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Not actively enrolled in this course' }, { status: 403 });
    }

    // 2. Max Attempts Check
    // Get all quizzes for this module to check attempts
    const moduleQuizzes = await prisma.quiz.findMany({
      where: { moduleId },
      select: { id: true }
    });
    const moduleQuizIds = moduleQuizzes.map(q => q.id);

    const maxExamAttempt = await prisma.quizAttempt.aggregate({
      where: { userId: user.id, quizId: { in: moduleQuizIds } },
      _max: { attemptNum: true }
    });

    const currentAttemptCount = maxExamAttempt._max.attemptNum || 0;
    if (currentAttemptCount >= 3) {
      return NextResponse.json({ error: 'আপনি এই পরীক্ষার সর্বোচ্চ ৩টি সুযোগ ব্যবহার করেছেন। (Max attempts reached)' }, { status: 403 });
    }

    // 3. Fetch previously attempted quiz IDs to exclude them
    const previousAttempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id, quizId: { in: moduleQuizIds } },
      select: { quizId: true }
    });
    const attemptedQuizIds = previousAttempts.map(a => a.quizId);

    // 4. Fetch unattempted Quiz questions (without the correct answer)
    const unattemptedQuizzes = await prisma.quiz.findMany({
      where: { 
        moduleId,
        id: { notIn: attemptedQuizIds }
      },
      select: {
        id: true,
        question: true,
        options: true,
        // INTENTIONALLY NOT SELECTING 'correct' OR 'explanation'
      }
    });

    // 5. Shuffle and pick 20
    const shuffled = unattemptedQuizzes.sort(() => 0.5 - Math.random());
    const selectedQuizzes = shuffled.slice(0, 20);

    return NextResponse.json({ success: true, quizzes: selectedQuizzes });

  } catch (error) {
    console.error('[GET_QUIZ_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
