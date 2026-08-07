import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// GET /api/admin/batches/[id]
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        students: {
          include: { user: { select: { id: true, name: true, email: true, mobile: true, status: true, createdAt: true } } },
          orderBy: { enrolledAt: 'desc' }
        },
        courses: {
          include: { course: { select: { id: true, title: true, status: true, type: true, enrolledCount: true } } },
          orderBy: { assignedAt: 'asc' }
        }
      }
    });

    if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    return NextResponse.json(batch);
  } catch (error) {
    console.error('[ADMIN_BATCH_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/admin/batches/[id]
export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { name, description, status, coursesLocked } = body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (coursesLocked !== undefined) updateData.coursesLocked = coursesLocked;

    const batch = await prisma.batch.update({ where: { id }, data: updateData });
    return NextResponse.json(batch);
  } catch (error) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Batch name already exists.' }, { status: 409 });
    if (error.code === 'P2025') return NextResponse.json({ error: 'Batch not found.' }, { status: 404 });
    console.error('[ADMIN_BATCH_PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/admin/batches/[id]
export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    await prisma.batch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Batch not found.' }, { status: 404 });
    console.error('[ADMIN_BATCH_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
