import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// PATCH - edit a quiz question
export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { quizId } = await params;
    const { question, options, correct, explanation } = await req.json();

    const quiz = await prisma.subjectFinalExamQuiz.update({
      where: { id: quizId },
      data: {
        question,
        options,
        correct: parseInt(correct),
        explanation: explanation || null
      }
    });

    return NextResponse.json(quiz);
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });
    console.error('[ADMIN_SUBJECT_FINAL_EXAM_QUIZ_PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - remove a quiz
export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { quizId } = await params;
    await prisma.subjectFinalExamQuiz.delete({ where: { id: quizId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });
    console.error('[ADMIN_SUBJECT_FINAL_EXAM_QUIZ_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
