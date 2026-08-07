import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { uploadImage } from '@/lib/cloudinary';

export async function GET(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, subjects: true } },
      },
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('[ADMIN_GET_COURSES_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    // In a real app, use Zod here. Basic validation for demo:
    if (!body.title || !body.description || !body.instructorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let finalCoverUrl = body.coverImageUrl || null;
    if (body.coverImageFile) {
      try {
        finalCoverUrl = await uploadImage(body.coverImageFile, 'iqc-academy/courses');
      } catch (err) {
        return NextResponse.json({ error: 'Failed to upload cover image' }, { status: 500 });
      }
    }

    const newCourse = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type || 'FREE',
        price: body.price ? parseFloat(body.price) : null,
        status: body.status || 'DRAFT',
        level: body.level || 'Beginner',
        duration: body.duration || '0 hours',
        instructorId: body.instructorId,
        coverImageUrl: finalCoverUrl,
        tags: body.tags || [],
        features: body.features || [],
      }
    });

    return NextResponse.json({ success: true, course: newCourse }, { status: 201 });

  } catch (error) {
    console.error('[ADMIN_CREATE_COURSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
