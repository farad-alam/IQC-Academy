import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

/**
 * GET /api/courses/[id]/payment-status
 * Returns the current payment/enrollment status for the logged-in user and this course.
 */
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const { id: courseId } = resolvedParams;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ status: 'NOT_PAID', enrolled: false });
    }

    // Check active enrollment first
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } }
    });

    if (enrollment) {
      return NextResponse.json({ status: 'ENROLLED', enrolled: true, enrollment });
    }

    // Check donations (most recent first)
    const donation = await prisma.donation.findFirst({
      where: { userId: user.id, courseId },
      orderBy: { createdAt: 'desc' }
    });

    if (!donation) {
      return NextResponse.json({ status: 'NOT_PAID', enrolled: false });
    }

    return NextResponse.json({
      status: donation.status, // PENDING | VERIFIED | REJECTED
      enrolled: false,
      donation: {
        id: donation.id,
        amount: Number(donation.amount),
        method: donation.method,
        txId: donation.txId,
        mobile: donation.mobile,
        status: donation.status,
        rejectionReason: donation.rejectionReason,
        createdAt: donation.createdAt,
      }
    });

  } catch (error) {
    console.error('[PAYMENT_STATUS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
