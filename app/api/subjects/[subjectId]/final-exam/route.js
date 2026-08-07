import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export const dynamic = 'force-dynamic';

// GET - Get subject final exam quizzes for student (shuffled, answers stripped)
export async function GET(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { subjectId } = await params;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { finalExamQuizzes: true }
    });

    if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    if (!subject.finalExamEnabled) return NextResponse.json({ error: 'Final exam not enabled for this subject.' }, { status: 403 });

    // Check if student has already attempted
    const existing = await prisma.subjectFinalExamSession.findUnique({
      where: { userId_subjectId: { userId: user.id, subjectId } }
    });

    if (existing) {
      return NextResponse.json({ error: 'You have already taken this exam.', session: existing }, { status: 409 });
    }

    // Shuffle and slice
    const shuffled = [...subject.finalExamQuizzes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, subject.finalExamDisplayCount || 20);

    // Strip correct answer before sending to client
    const safeQuizzes = selected.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));

    return NextResponse.json({
      quizzes: safeQuizzes,
      subject: {
        id: subject.id,
        title: subject.title,
        finalExamPassMark: subject.finalExamPassMark,
        finalExamDisplayCount: subject.finalExamDisplayCount
      }
    });
  } catch (error) {
    console.error('[SUBJECT_FINAL_EXAM_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
