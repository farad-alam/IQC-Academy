import { NextResponse } from 'next/server';
import { hash } from 'argon2';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { checkRateLimit } from '@/lib/middleware/withRateLimit';

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimit = await checkRateLimit(`reset_pw_${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Invalid input parameters' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    // Verify OTP
    const validOtp = await prisma.otpToken.findFirst({
      where: {
        userId: user.id,
        purpose: 'PASSWORD_RESET',
        code: otpHash,
        usedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    if (!validOtp) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Hash new password
    const passwordHash = await hash(newPassword);

    // Update password and mark OTP as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
      }),
      prisma.otpToken.update({
        where: { id: validOtp.id },
        data: { usedAt: new Date() }
      }),
      // Force logout on all devices
      prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Password reset successfully' });

  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
