import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser, isSuperAdmin } from '@/lib/middleware/withAuth';

// POST /api/admin/users/[id]/role
// Body: { action: 'PROMOTE_TO_ADMIN' | 'DEMOTE_TO_STUDENT' }
// Restricted to SUPER_ADMIN only
export async function POST(req, { params }) {
  try {
    const requestingUser = await getAuthUser();
    if (!isSuperAdmin(requestingUser)) {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required.' }, { status: 403 });
    }

    const { id: targetUserId } = await params;
    const { action } = await req.json();

    if (!['PROMOTE_TO_ADMIN', 'DEMOTE_TO_STUDENT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    }

    // Fetch the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Cannot promote/demote another SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot change role of another Super Admin.' }, { status: 403 });
    }

    // Cannot demote yourself
    if (targetUser.id === requestingUser.id) {
      return NextResponse.json({ error: 'Cannot change your own role.' }, { status: 403 });
    }

    const newRole = action === 'PROMOTE_TO_ADMIN' ? 'ADMIN' : 'STUDENT';

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true }
    });

    // If demoted from ADMIN → revoke all refresh tokens to force re-login
    if (newRole === 'STUDENT') {
      await prisma.refreshToken.updateMany({
        where: { userId: targetUserId, revokedAt: null },
        data: { revokedAt: new Date() }
      });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('[USER_ROLE_CHANGE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
