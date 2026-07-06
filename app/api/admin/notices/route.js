import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function POST(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    if (!body.title || !body.body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const newNotice = await prisma.notice.create({
      data: {
        title: body.title,
        body: body.body,
        link: body.link,
        linkText: body.linkText,
        important: body.important || false,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      }
    });

    return NextResponse.json({ success: true, notice: newNotice }, { status: 201 });

  } catch (error) {
    console.error('[ADMIN_CREATE_NOTICE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
