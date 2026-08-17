import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id: courseId } = resolvedParams;

    const quizzes = await prisma.finalExamQuiz.findMany({
      where: { courseId },
      orderBy: { id: 'asc' }
    });

    return NextResponse.json({ success: true, quizzes });
  } catch (error) {
    console.error('[ADMIN_GET_FINAL_EXAM_QUIZZES_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id: courseId } = resolvedParams;
    const body = await req.json();
    const { question, options, correct, explanation } = body;

    if (!question || !options || options.length < 2 || correct === undefined) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const quiz = await prisma.finalExamQuiz.create({
      data: {
        courseId,
        question,
        options,
        correct,
        explanation
      }
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error('[ADMIN_CREATE_FINAL_EXAM_QUIZ_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
