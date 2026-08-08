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
    const { name, title, avatarUrl } = body;

    const updated = await prisma.instructor.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(title !== undefined && { title }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
    });

    return NextResponse.json({ success: true, instructor: updated });
  } catch (error) {
    console.error('[ADMIN_UPDATE_INSTRUCTOR_ERROR]', error);
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

    // Check if any courses are attached. If they are, update them to have null instructorId
    await prisma.course.updateMany({
      where: { instructorId: id },
      data: { instructorId: null },
    });

    await prisma.instructor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_DELETE_INSTRUCTOR_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
