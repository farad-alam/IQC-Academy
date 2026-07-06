import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: courseId } = params;
    const body = await req.json();

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        price: body.price ? parseFloat(body.price) : undefined,
        status: body.status,
        level: body.level,
        duration: body.duration,
        coverImageUrl: body.coverImageUrl,
        tags: body.tags,
        features: body.features,
      }
    });

    return NextResponse.json({ success: true, course: updatedCourse });

  } catch (error) {
    console.error('[ADMIN_UPDATE_COURSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
