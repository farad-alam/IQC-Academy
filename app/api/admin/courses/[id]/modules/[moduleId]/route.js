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
    const { moduleId } = resolvedParams;

    await prisma.module.delete({
      where: { id: moduleId }
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
    if (body.pdfUrl !== undefined) updateData.pdfUrl = body.pdfUrl;
    if (body.body !== undefined) updateData.body = body.body;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.duration !== undefined) updateData.duration = body.duration;

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
