import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const whereClause = {};
    if (status) whereClause.status = status;

    const donations = await prisma.donation.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, donations });

  } catch (error) {
    console.error('[ADMIN_GET_DONATIONS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
