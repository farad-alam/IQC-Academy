import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// GET - list students in a batch with their enrollment data
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: batchId } = await params;

    // Get batch courses first to know what to check enrollment for
    const batchCourses = await prisma.batchCourse.findMany({
      where: { batchId },
      select: { courseId: true }
    });
    const courseIds = batchCourses.map(bc => bc.courseId);

    const batchStudents = await prisma.batchStudent.findMany({
      where: { batchId },
      include: {
        user: {
          select: {
            id: true, name: true, email: true, mobile: true, status: true,
            institution: true, district: true, createdAt: true,
            enrollments: courseIds.length > 0 ? {
              where: { courseId: { in: courseIds } },
              select: { courseId: true, status: true, progress: true, enrolledAt: true }
            } : false
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    return NextResponse.json(batchStudents);
  } catch (error) {
    console.error('[ADMIN_BATCH_STUDENTS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - manually add a student (by email or userId) to a batch
export async function POST(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: batchId } = await params;
    const { userId, email } = await req.json();

    let user;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    const batchStudent = await prisma.batchStudent.upsert({
      where: { batchId_userId: { batchId, userId: user.id } },
      create: { batchId, userId: user.id },
      update: {}
    });

    return NextResponse.json(batchStudent, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_BATCH_STUDENTS_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - remove a student from a batch
export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: batchId } = await params;
    const { userId } = await req.json();

    await prisma.batchStudent.delete({
      where: { batchId_userId: { batchId, userId } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Student not in batch.' }, { status: 404 });
    console.error('[ADMIN_BATCH_STUDENTS_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
