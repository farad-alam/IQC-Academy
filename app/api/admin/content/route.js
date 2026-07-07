import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function GET(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const published = searchParams.get('published');

    const where = {};
    if (type) where.type = type;
    if (published !== null && published !== undefined) where.published = published === 'true';

    const content = await prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('[ADMIN_GET_CONTENT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, type, body: contentBody, videoUrl, pdfUrl, tags, readingTime, published } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'শিরোনাম আবশ্যক' }, { status: 400 });
    }
    if (!type || !['ARTICLE', 'VIDEO', 'PDF'].includes(type)) {
      return NextResponse.json({ error: 'সঠিক ধরন নির্বাচন করুন' }, { status: 400 });
    }

    const newContent = await prisma.content.create({
      data: {
        title: title.trim(),
        type,
        body: contentBody || null,
        videoUrl: videoUrl || null,
        pdfUrl: pdfUrl || null,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        readingTime: readingTime || null,
        published: published === true || published === 'true',
      },
    });

    return NextResponse.json({ success: true, content: newContent }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_CREATE_CONTENT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
