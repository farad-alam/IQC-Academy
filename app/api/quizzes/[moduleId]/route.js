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

    // 2. Fetch Quiz questions (without the correct answer)
    const quizzes = await prisma.quiz.findMany({
      where: { moduleId },
      select: {
        id: true,
        question: true,
        options: true,
        // INTENTIONALLY NOT SELECTING 'correct' OR 'explanation'
      }
    });

    return NextResponse.json({ success: true, quizzes });

  } catch (error) {
    console.error('[GET_QUIZ_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
