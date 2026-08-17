import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function POST(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected an array of { id, order }' }, { status: 400 });
    }

    // Use a transaction to update all orders safely
    await prisma.$transaction(
      body.map((item) =>
        prisma.notice.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true, message: 'Reordered successfully' });

  } catch (error) {
    console.error('[ADMIN_REORDER_NOTICES_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
