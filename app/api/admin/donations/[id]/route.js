import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id: donationId } = resolvedParams;
    const body = await req.json();
    const { action, courseIdToUnlock, rejectionReason } = body; // action: 'VERIFY' or 'REJECT'

    if (!['VERIFY', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const donation = await prisma.donation.findUnique({ where: { id: donationId } });
    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }
    if (donation.status !== 'PENDING') {
      return NextResponse.json({ error: 'Donation has already been processed' }, { status: 400 });
    }

    if (action === 'VERIFY') {
      // 1. Update Donation Status
      const updatedDonation = await prisma.donation.update({
        where: { id: donationId },
        data: {
          status: 'VERIFIED',
          verifiedBy: admin.id,
          verifiedAt: new Date(),
        }
      });

      // 2. If it was for a project, increment the project's raisedAmount
      if (donation.projectId) {
        await prisma.project.update({
          where: { id: donation.projectId },
          data: {
            raisedAmount: { increment: donation.amount },
            donorCount: { increment: 1 }
          }
        });
      }

      // 3. If a course ID was provided, unlock the course for the user
      if (courseIdToUnlock && donation.userId) {
        // Create active enrollment
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: { userId: donation.userId, courseId: courseIdToUnlock }
          },
          update: { status: 'ACTIVE' },
          create: {
            userId: donation.userId,
            courseId: courseIdToUnlock,
            status: 'ACTIVE'
          }
        });

        // Increment course enrolled count
        await prisma.course.update({
          where: { id: courseIdToUnlock },
          data: { enrolledCount: { increment: 1 } }
        });
      }

      return NextResponse.json({ success: true, message: 'Donation verified successfully', donation: updatedDonation });
    
    } else if (action === 'REJECT') {
      const updatedDonation = await prisma.donation.update({
        where: { id: donationId },
        data: {
          status: 'REJECTED',
          verifiedBy: admin.id,
          verifiedAt: new Date(),
          rejectionReason: rejectionReason || 'No reason provided'
        }
      });

      return NextResponse.json({ success: true, message: 'Donation rejected', donation: updatedDonation });
    }

  } catch (error) {
    console.error('[ADMIN_PATCH_DONATION_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
