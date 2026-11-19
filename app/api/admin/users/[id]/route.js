import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { sendApprovalEmail } from '@/lib/email';

export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: targetUserId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        whatsapp: true,
        facebook: true,
        avatarUrl: true,
        role: true,
        status: true,
        institution: true,
        division: true,
        district: true,
        upazila: true,
        dob: true,
        sscYear: true,
        sscBoard: true,
        sscRoll: true,
        sscGpa: true,
        totalPoints: true,
        currentStreak: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('[ADMIN_GET_USER_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id: targetUserId } = resolvedParams;
    const body = await req.json();
    const { action } = body; // 'APPROVE' or 'BAN'

    if (!['APPROVE', 'BAN'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const newStatus = action === 'APPROVE' ? 'ACTIVE' : 'BANNED';

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { status: newStatus },
      select: { id: true, name: true, email: true, status: true }
    });

    // If banned, revoke all their refresh tokens to kick them out immediately
    if (newStatus === 'BANNED') {
      await prisma.refreshToken.updateMany({
        where: { userId: targetUserId, revokedAt: null },
        data: { revokedAt: new Date() }
      });
    } else if (newStatus === 'ACTIVE') {
      // Send approval email
      await sendApprovalEmail(updatedUser.email, updatedUser.name);
    }

    return NextResponse.json({ 
      success: true, 
      message: `User successfully ${action.toLowerCase()}d.`,
      user: updatedUser 
    });

  } catch (error) {
    console.error('[ADMIN_PATCH_USER_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
