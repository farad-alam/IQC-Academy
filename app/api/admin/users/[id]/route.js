import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function PATCH(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: targetUserId } = params;
    const body = await req.json();
    const { action } = body; // 'APPROVE' or 'BAN'

    if (!['APPROVE', 'BAN'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const newStatus = action === 'APPROVE' ? 'ACTIVE' : 'BANNED';

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { status: newStatus },
      select: { id: true, name: true, status: true }
    });

    // If banned, revoke all their refresh tokens to kick them out immediately
    if (newStatus === 'BANNED') {
      await prisma.refreshToken.updateMany({
        where: { userId: targetUserId, revokedAt: null },
        data: { revokedAt: new Date() }
      });
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
