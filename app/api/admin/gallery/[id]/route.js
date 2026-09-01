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
    const { id } = resolvedParams;

    await prisma.galleryItem.delete({
      where: { id }
    });

    // Revalidate public gallery pages
    revalidatePath('/');
    revalidatePath('/gallery');

    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('[ADMIN_DELETE_GALLERY_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
