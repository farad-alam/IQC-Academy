import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { moduleId } = params;

    await prisma.module.delete({
      where: { id: moduleId }
    });

    return NextResponse.json({ success: true, message: 'Module deleted' });
  } catch (error) {
    console.error('[ADMIN_DELETE_MODULE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
