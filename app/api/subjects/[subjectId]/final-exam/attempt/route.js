import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// POST - submit subject final exam answers
export async function POST(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { subjectId } = await params;
    const { answers } = await req.json(); // { quizId: selectedIndex, ... }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Answers are required.' }, { status: 400 });
    }

    // Check if already attempted
    const existing = await prisma.subjectFinalExamSession.findUnique({
      where: { userId_subjectId: { userId: user.id, subjectId } }
    });
    if (existing) {
      return NextResponse.json({ error: 'You have already taken this exam.', session: existing }, { status: 409 });
    }

    // Get subject and all quizzes submitted
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) return NextResponse.json({ error: 'Subject not found.' }, { status: 404 });

    const quizIds = Object.keys(answers);
    const quizzes = await prisma.subjectFinalExamQuiz.findMany({
      where: { id: { in: quizIds }, subjectId }
    });

    // Calculate score — 1 mark per correct answer, total is always 50
    let score = 0;
    for (const quiz of quizzes) {
      if (parseInt(answers[quiz.id]) === quiz.correct) score++;
    }

    const total = 50; // Always out of 50 marks
    const passed = score >= (subject.finalExamPassMark || 30);

    // Save session
    const session = await prisma.subjectFinalExamSession.create({
      data: {
        userId: user.id,
        subjectId,
        score,
        total,
        passed,
        answers
      }
    });

    // Build result with explanations
    const results = quizzes.map(quiz => ({
      id: quiz.id,
      question: quiz.question,
      options: quiz.options,
      correct: quiz.correct,
      explanation: quiz.explanation,
      userAnswer: parseInt(answers[quiz.id]),
      isCorrect: parseInt(answers[quiz.id]) === quiz.correct
    }));

    return NextResponse.json({
      success: true,
      score,
      total,
      passed,
      passMarkRequired: subject.finalExamPassMark,
      session,
      results
    });
  } catch (error) {
    console.error('[SUBJECT_FINAL_EXAM_ATTEMPT]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
