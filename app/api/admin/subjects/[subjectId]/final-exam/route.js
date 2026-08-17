import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// GET - list final exam quizzes for a subject
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { subjectId } = await params;
    const quizzes = await prisma.subjectFinalExamQuiz.findMany({
      where: { subjectId },
      orderBy: { id: 'asc' }
    });

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: { finalExamEnabled: true, finalExamPassMark: true, finalExamDisplayCount: true, title: true }
    });

    return NextResponse.json({ quizzes, subject });
  } catch (error) {
    console.error('[ADMIN_SUBJECT_FINAL_EXAM_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - add a quiz to the subject final exam
export async function POST(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { subjectId } = await params;
    const { question, options, correct, explanation } = await req.json();

    if (!question || !options || options.length < 2 || correct === undefined) {
      return NextResponse.json({ error: 'Question, options, and correct index are required.' }, { status: 400 });
    }

    const quiz = await prisma.subjectFinalExamQuiz.create({
      data: { subjectId, question, options, correct: parseInt(correct), explanation: explanation || null }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_SUBJECT_FINAL_EXAM_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
