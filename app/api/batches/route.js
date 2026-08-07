import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/batches - list all batches open for enrollment (public)
export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      where: { status: 'ENROLLING' },
      include: {
        courses: {
          include: {
            course: { select: { id: true, title: true, level: true, type: true, coverImageUrl: true, description: true } }
          }
        },
        _count: { select: { students: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error('[BATCHES_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
