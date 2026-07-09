import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { quizId } = resolvedParams;

    await prisma.quiz.delete({
      where: { id: quizId }
    });

    return NextResponse.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    console.error('[ADMIN_DELETE_QUIZ_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { quizId } = resolvedParams;
    const body = await req.json();
    
    const updateData = {};
    if (body.question !== undefined) updateData.question = body.question;
    if (body.options !== undefined) updateData.options = body.options;
    if (body.correct !== undefined) updateData.correct = body.correct;
    if (body.explanation !== undefined) updateData.explanation = body.explanation;

    const updated = await prisma.quiz.update({
      where: { id: quizId },
      data: updateData
    });

    return NextResponse.json({ success: true, quiz: updated });
  } catch (error) {
    console.error('[ADMIN_UPDATE_QUIZ_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
