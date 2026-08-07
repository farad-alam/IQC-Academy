import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { uploadImage } from '@/lib/cloudinary';

// GET /api/admin/subjects/[subjectId]/modules
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { subjectId } = await params;
    const modules = await prisma.module.findMany({
      where: { subjectId },
      include: { _count: { select: { quizzes: true } } },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error('[ADMIN_SUBJECT_MODULES_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/subjects/[subjectId]/modules
export async function POST(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { subjectId } = await params;
    const body = await req.json();
    const { title, contentType, videoUrl, pdfUrl, pdfFile, body: contentBody, order, quizPassMark, quizDisplayCount } = body;

    if (!title || !contentType) {
      return NextResponse.json({ error: 'Title and content type are required' }, { status: 400 });
    }

    // Verify subject exists
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) return NextResponse.json({ error: 'Subject not found.' }, { status: 404 });

    let finalPdfUrl = pdfUrl;
    if (contentType === 'PDF' && pdfFile) {
      try {
        finalPdfUrl = await uploadImage(pdfFile, 'iqc-academy/modules');
      } catch (err) {
        return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
      }
    }

    // Get next order
    const lastModule = await prisma.module.findFirst({
      where: { subjectId },
      orderBy: { order: 'desc' }
    });
    const nextOrder = order ?? (lastModule?.order ?? -1) + 1;

    const module = await prisma.module.create({
      data: {
        subjectId,
        title,
        contentType,
        videoUrl: contentType === 'VIDEO' ? videoUrl : null,
        pdfUrl: contentType === 'PDF' ? finalPdfUrl : null,
        body: contentType === 'TEXT' ? contentBody : null,
        order: nextOrder,
        quizPassMark: quizPassMark || 80,
        quizDisplayCount: quizDisplayCount || 20,
      },
      include: { _count: { select: { quizzes: true } } }
    });

    return NextResponse.json({ success: true, module }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_SUBJECT_MODULES_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
