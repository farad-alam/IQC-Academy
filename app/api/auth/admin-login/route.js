import { NextResponse } from 'next/server';
import { verify } from 'argon2';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { loginSchema } from '@/lib/validation/auth.schema';
import { checkRateLimit } from '@/lib/middleware/withRateLimit';
import { signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimit = await checkRateLimit(`admin_login_${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // 2. Parse and Validate
    const body = await req.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
    }

    const { email, password } = result.data;

    // 3. Find User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 4. Verify Admin Role FIRST
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
    }

    // 5. Verify Password
    const isValid = await verify(user.passwordHash, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status === 'BANNED') {
      return NextResponse.json({ error: 'Account is banned.' }, { status: 403 });
    }

    // 6. Generate Tokens
    const tokenPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = await signAccessToken(tokenPayload);
    const refreshTokenPlain = crypto.randomBytes(32).toString('hex');
    const refreshTokenSigned = await signRefreshToken({ token: refreshTokenPlain });

    // 7. Store Refresh Token Hash in DB
    const tokenHash = crypto.createHash('sha256').update(refreshTokenPlain).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        userAgent: req.headers.get('user-agent'),
        ipAddress: ip,
      }
    });

    // 8. Set Cookies
    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, role: user.role, status: user.status } 
    });

    response.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set({
      name: 'refreshToken',
      value: refreshTokenSigned,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh', // Restrict to refresh endpoint
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error) {
    console.error('[ADMIN_LOGIN_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
