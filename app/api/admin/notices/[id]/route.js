import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: noticeId } = params;

    await prisma.notice.delete({
      where: { id: noticeId }
    });

    return NextResponse.json({ success: true, message: 'Notice deleted successfully' });

  } catch (error) {
    console.error('[ADMIN_DELETE_NOTICE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
