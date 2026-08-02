import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { uploadImage } from '@/lib/cloudinary';

export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { moduleId } = resolvedParams;

    await prisma.$transaction(async (tx) => {
      // 1. Delete quiz attempts for quizzes in this module
      const quizzes = await tx.quiz.findMany({
        where: { moduleId },
        select: { id: true }
      });
      
      const quizIds = quizzes.map(q => q.id);
      if (quizIds.length > 0) {
        await tx.quizAttempt.deleteMany({
          where: { quizId: { in: quizIds } }
        });
      }

      // 2. Delete the module (Prisma handles cascading for Quiz and ModuleCompletion)
      await tx.module.delete({
        where: { id: moduleId }
      });
    });

    return NextResponse.json({ success: true, message: 'Module deleted' });
  } catch (error) {
    console.error('[ADMIN_DELETE_MODULE_ERROR]', error);
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
    const { moduleId } = resolvedParams;
    const body = await req.json();
    
    const updateData = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.contentType !== undefined) updateData.contentType = body.contentType;
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.body !== undefined) updateData.body = body.body;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.quizPassMark !== undefined) updateData.quizPassMark = body.quizPassMark;
    if (body.quizDisplayCount !== undefined) updateData.quizDisplayCount = body.quizDisplayCount;

    if (body.pdfFile) {
      try {
        const url = await uploadImage(body.pdfFile, 'iqc-academy/modules');
        updateData.pdfUrl = url;
      } catch (err) {
        return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
      }
    } else if (body.pdfUrl !== undefined) {
      updateData.pdfUrl = body.pdfUrl;
    }

    const updated = await prisma.module.update({
      where: { id: moduleId },
      data: updateData,
      include: { _count: { select: { quizzes: true } } }
    });

    return NextResponse.json({ success: true, module: updated });
  } catch (error) {
    console.error('[ADMIN_UPDATE_MODULE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
