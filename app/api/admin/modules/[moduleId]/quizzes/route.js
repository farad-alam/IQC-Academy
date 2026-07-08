import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function POST(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { moduleId } = resolvedParams;
    const body = await req.json();
    const { question, options, correct, explanation } = body;

    if (!question || !options || options.length < 2 || correct === undefined) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        moduleId,
        question,
        options,
        correct,
        explanation
      }
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error('[ADMIN_CREATE_QUIZ_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
