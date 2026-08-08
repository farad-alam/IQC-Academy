import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { uploadImage } from '@/lib/cloudinary';
import { validateDeletionKey } from '@/lib/security';

// PATCH /api/admin/modules/[moduleId]
export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { moduleId } = await params;
    const body = await req.json();
    const { title, contentType, videoUrl, pdfUrl, pdfFile, body: contentBody, quizPassMark, quizDisplayCount } = body;

    let finalPdfUrl = pdfUrl;
    if (contentType === 'PDF' && pdfFile) {
      try { finalPdfUrl = await uploadImage(pdfFile, 'iqc-academy/modules'); }
      catch { return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 }); }
    }

    const module = await prisma.module.update({
      where: { id: moduleId },
      data: {
        title,
        contentType,
        videoUrl: contentType === 'VIDEO' ? videoUrl : null,
        pdfUrl: contentType === 'PDF' ? finalPdfUrl : null,
        body: contentType === 'TEXT' ? contentBody : null,
        quizPassMark: quizPassMark || 80,
        quizDisplayCount: quizDisplayCount || 20,
      },
      include: { _count: { select: { quizzes: true } } }
    });

    return NextResponse.json({ success: true, module });
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Module not found.' }, { status: 404 });
    console.error('[ADMIN_MODULE_PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/admin/modules/[moduleId]
export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { moduleId } = await params;

    const securityError = await validateDeletionKey(req);
    if (securityError) return securityError;
    await prisma.module.delete({ where: { id: moduleId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Module not found.' }, { status: 404 });
    console.error('[ADMIN_MODULE_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
