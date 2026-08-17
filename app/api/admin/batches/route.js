import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// GET /api/admin/batches - list all batches
export async function GET() {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const batches = await prisma.batch.findMany({
      include: {
        _count: { select: { students: true, courses: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error('[ADMIN_BATCHES_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/batches - create a new batch
export async function POST(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, description } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Batch name is required.' }, { status: 400 });
    }

    const batch = await prisma.batch.create({
      data: { name: name.trim(), description: description?.trim() || null }
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A batch with this name already exists.' }, { status: 409 });
    }
    console.error('[ADMIN_BATCHES_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
