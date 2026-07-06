import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/middleware/withRateLimit';

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimit = await checkRateLimit(`forgot_pw_${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // For security, do not reveal if the user exists
    if (user) {
      // 1. Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 2. Hash OTP before storing
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

      // 3. Clear existing active OTPs for this user
      await prisma.otpToken.updateMany({
        where: { userId: user.id, purpose: 'PASSWORD_RESET', usedAt: null },
        data: { usedAt: new Date() }
      });

      // 4. Save new OTP
      await prisma.otpToken.create({
        data: {
          userId: user.id,
          code: otpHash,
          purpose: 'PASSWORD_RESET',
          expiresAt
        }
      });

      // 5. Send Email
      await sendPasswordResetEmail(user.email, otp);
    }

    return NextResponse.json({ success: true, message: 'If the email exists, an OTP has been sent.' });

  } catch (error) {
    console.error('[FORGOT_PASSWORD_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
