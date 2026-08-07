import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// GET - list courses assigned to a batch
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: batchId } = await params;
    const batchCourses = await prisma.batchCourse.findMany({
      where: { batchId },
      include: {
        course: {
          select: { id: true, title: true, status: true, type: true, level: true, enrolledCount: true, coverImageUrl: true }
        }
      },
      orderBy: { assignedAt: 'asc' }
    });

    return NextResponse.json(batchCourses);
  } catch (error) {
    console.error('[ADMIN_BATCH_COURSES_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - assign a course to a batch
export async function POST(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: batchId } = await params;
    const { courseId } = await req.json();

    if (!courseId) return NextResponse.json({ error: 'courseId is required.' }, { status: 400 });

    const batchCourse = await prisma.batchCourse.upsert({
      where: { batchId_courseId: { batchId, courseId } },
      create: { batchId, courseId },
      update: {}
    });

    return NextResponse.json(batchCourse, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_BATCH_COURSES_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - remove a course from a batch
export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: batchId } = await params;
    const { courseId } = await req.json();

    await prisma.batchCourse.delete({
      where: { batchId_courseId: { batchId, courseId } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Course not assigned to this batch.' }, { status: 404 });
    console.error('[ADMIN_BATCH_COURSES_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
