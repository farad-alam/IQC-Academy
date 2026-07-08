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
