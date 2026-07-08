import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params;
    const { id: courseId } = resolvedParams;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account not approved yet' }, { status: 403 });
    }

    // 1. Fetch course
    const course = await prisma.course.findUnique({
      where: { id: courseId, status: 'PUBLISHED' }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // 2. Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
    }

    // 3. Prevent direct enrollment for PAID courses
    // Paid courses require admin verification of a donation.
    if (course.type === 'PAID') {
      return NextResponse.json({ 
        error: 'Payment required',
        message: 'This is a paid course. Please complete a donation and wait for admin verification.' 
      }, { status: 403 });
    }

    // 4. Create enrollment (Free course)
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId,
        status: 'ACTIVE',
      }
    });

    // Update course enrolled count
    await prisma.course.update({
      where: { id: courseId },
      data: { enrolledCount: { increment: 1 } }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully enrolled in course',
      enrollment 
    });

  } catch (error) {
    console.error('[ENROLL_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
