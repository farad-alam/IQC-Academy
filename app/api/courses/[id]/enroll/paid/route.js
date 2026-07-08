import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function POST(req, { params }) {
  try {
    const { id: courseId } = params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account not approved yet' }, { status: 403 });
    }

    const body = await req.json();
    const { method, txId, mobile } = body;

    if (!method || !txId || !mobile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch course
    const course = await prisma.course.findUnique({
      where: { id: courseId, status: 'PUBLISHED' }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.type !== 'PAID') {
      return NextResponse.json({ error: 'Course is free' }, { status: 400 });
    }

    // 2. Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
    }

    // 3. Create a pending Donation record tied to this course
    const donation = await prisma.donation.create({
      data: {
        userId: user.id,
        courseId: course.id,
        name: user.name,
        mobile,
        amount: course.price,
        txId,
        method,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment submitted successfully. Waiting for admin verification.',
      donation 
    });

  } catch (error) {
    console.error('[ENROLL_PAID_ERROR]', error);
    if (error.code === 'P2002') { // Unique constraint violation (likely txId)
       return NextResponse.json({ error: 'This Transaction ID has already been used.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
