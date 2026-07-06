import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { verifyRefreshToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const refreshTokenCookie = req.cookies.get('refreshToken')?.value;
    
    if (refreshTokenCookie) {
      const payload = await verifyRefreshToken(refreshTokenCookie);
      
      if (payload && payload.token) {
        const tokenHash = crypto.createHash('sha256').update(payload.token).digest('hex');
        
        // Revoke token in DB if it exists
        await prisma.refreshToken.updateMany({
          where: { tokenHash, revokedAt: null },
          data: { revokedAt: new Date() }
        });
      }
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear cookies
    response.cookies.set({
      name: 'accessToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    response.cookies.set({
      name: 'refreshToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 0,
    });

    return response;

  } catch (error) {
    console.error('[LOGOUT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
