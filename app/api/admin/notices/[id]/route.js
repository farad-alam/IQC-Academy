import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id: noticeId } = resolvedParams;

    await prisma.notice.delete({ where: { id: noticeId } });

    // Revalidate notice pages
    revalidatePath('/');
    revalidatePath('/notices');
    revalidatePath(`/notices/${noticeId}`);

    return NextResponse.json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    console.error('[ADMIN_DELETE_NOTICE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id: noticeId } = resolvedParams;
    const body = await req.json();

    if (!body.title || !body.body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const updatedNotice = await prisma.notice.update({
      where: { id: noticeId },
      data: {
        title: body.title,
        body: body.body,
        link: body.link,
        linkText: body.linkText,
        important: body.important || false,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      }
    });

    // Revalidate notice pages
    revalidatePath('/');
    revalidatePath('/notices');
    revalidatePath(`/notices/${noticeId}`);

    return NextResponse.json({ success: true, notice: updatedNotice }, { status: 200 });
  } catch (error) {
    console.error('[ADMIN_UPDATE_NOTICE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
