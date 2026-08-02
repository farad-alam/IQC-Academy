import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.instructorId !== undefined && { instructorId: body.instructorId }),
        ...(body.price !== undefined && { price: body.price ? parseFloat(body.price) : null }),
        ...(body.certificate !== undefined && { certificate: body.certificate }),
        ...(body.language !== undefined && { language: body.language }),
        ...(body.tags !== undefined && { tags: Array.isArray(body.tags) ? body.tags : body.tags.split(',').map(t => t.trim()).filter(Boolean) }),
        ...(body.finalExamEnabled !== undefined && { finalExamEnabled: body.finalExamEnabled }),
        ...(body.finalExamPassMark !== undefined && { finalExamPassMark: body.finalExamPassMark }),
        ...(body.finalExamDisplayCount !== undefined && { finalExamDisplayCount: body.finalExamDisplayCount }),
      },
      include: {
        instructor: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, modules: true } },
      },
    });

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error('[ADMIN_PATCH_COURSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    // We must manually delete/detach relations that don't have onDelete: Cascade in the schema
    await prisma.$transaction(async (tx) => {
      // 1. Detach from donations (financial records shouldn't be deleted)
      await tx.donation.updateMany({
        where: { courseId: id },
        data: { courseId: null },
      });

      // 2. Delete enrollments for this course
      await tx.enrollment.deleteMany({
        where: { courseId: id },
      });

      // 3. Delete quiz attempts for quizzes in this course's modules
      const modules = await tx.module.findMany({
        where: { courseId: id },
        select: { id: true, quizzes: { select: { id: true } } }
      });
      
      const quizIds = modules.flatMap(m => m.quizzes.map(q => q.id));
      if (quizIds.length > 0) {
        await tx.quizAttempt.deleteMany({
          where: { quizId: { in: quizIds } }
        });
      }

      // 4. Delete the course (Prisma will cascade delete Modules, Quizzes, ModuleCompletions)
      await tx.course.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_DELETE_COURSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
