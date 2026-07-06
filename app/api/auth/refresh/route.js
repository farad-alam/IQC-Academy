import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { checkRateLimit } from '@/lib/middleware/withRateLimit';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimit = await checkRateLimit(`refresh_${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const refreshTokenCookie = req.cookies.get('refreshToken')?.value;
    if (!refreshTokenCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyRefreshToken(refreshTokenCookie);
    if (!payload || !payload.token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tokenHash = crypto.createHash('sha256').update(payload.token).digest('hex');

    // Find valid token in DB
    const dbToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!dbToken || dbToken.expiresAt < new Date() || dbToken.revokedAt) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user status
    if (dbToken.user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account is not active' }, { status: 403 });
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { revokedAt: new Date() }
    });

    // Generate new tokens
    const accessToken = await signAccessToken({
      userId: dbToken.user.id,
      role: dbToken.user.role,
    });
    
    const newRefreshTokenPlain = crypto.randomBytes(32).toString('hex');
    const newRefreshTokenSigned = await signRefreshToken({ token: newRefreshTokenPlain });
    const newTokenHash = crypto.createHash('sha256').update(newRefreshTokenPlain).digest('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: dbToken.user.id,
        tokenHash: newTokenHash,
        expiresAt,
        userAgent: req.headers.get('user-agent'),
        ipAddress: ip,
      }
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    response.cookies.set({
      name: 'refreshToken',
      value: newRefreshTokenSigned,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    console.error('[REFRESH_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
