import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function POST(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: courseId } = params;
    const body = await req.json();
    const { title, contentType, videoUrl, pdfUrl, body: contentBody, order } = body;

    if (!title || !contentType) {
      return NextResponse.json({ error: 'Title and content type are required' }, { status: 400 });
    }

    const module = await prisma.module.create({
      data: {
        courseId,
        title,
        contentType,
        videoUrl: contentType === 'VIDEO' ? videoUrl : null,
        pdfUrl: contentType === 'PDF' ? pdfUrl : null,
        body: contentType === 'TEXT' ? contentBody : null,
        order: order || 1,
      },
      include: {
        _count: { select: { quizzes: true } }
      }
    });

    return NextResponse.json({ success: true, module });
  } catch (error) {
    console.error('[ADMIN_CREATE_MODULE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
