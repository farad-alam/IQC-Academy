import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { uploadImage } from '@/lib/cloudinary';

export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    let finalImageUrl = body.imageUrl;
    if (body.coverImageFile) {
      try {
        finalImageUrl = await uploadImage(body.coverImageFile, 'iqc-academy/projects');
      } catch (err) {
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.description !== undefined && { description: body.description.trim() }),
        ...(body.targetAmount !== undefined && { targetAmount: body.targetAmount }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.status !== undefined && { status: body.status }),
        ...(finalImageUrl !== undefined && { imageUrl: finalImageUrl }),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error('[ADMIN_PATCH_PROJECT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_DELETE_PROJECT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
