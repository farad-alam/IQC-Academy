import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/batches/[id] - public batch detail
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true, title: true, level: true, type: true,
                coverImageUrl: true, description: true, duration: true
              }
            }
          }
        },
        _count: { select: { students: true } }
      }
    });

    if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    return NextResponse.json(batch);
  } catch (error) {
    console.error('[BATCH_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
