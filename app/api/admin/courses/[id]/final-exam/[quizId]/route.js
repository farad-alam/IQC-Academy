import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { validateDeletionKey } from '@/lib/security';

export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { quizId } = resolvedParams;

    const securityError = await validateDeletionKey(req);
    if (securityError) return securityError;

    await prisma.finalExamQuiz.delete({
      where: { id: quizId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_DELETE_FINAL_EXAM_QUIZ_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
