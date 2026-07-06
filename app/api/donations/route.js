import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { donationSchema } from '@/lib/validation/donation.schema';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { checkRateLimit } from '@/lib/middleware/withRateLimit';

export async function POST(req) {
  try {
    // 1. Rate Limiting to prevent spam
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimit = await checkRateLimit(`donation_${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // 2. Validate input
    const body = await req.json();
    const result = donationSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 });
    }

    const data = result.data;

    // 3. Optional Authentication (Donations can be anonymous)
    const user = await getAuthUser();

    // 4. Check for duplicate Transaction ID (Fraud Prevention)
    const existingDonation = await prisma.donation.findUnique({
      where: { txId: data.txId }
    });

    if (existingDonation) {
      return NextResponse.json({ 
        error: 'Duplicate Transaction',
        message: 'This Transaction ID has already been submitted.' 
      }, { status: 409 });
    }

    // 5. Create Donation Record
    // Note: status defaults to 'PENDING'
    const newDonation = await prisma.donation.create({
      data: {
        userId: user ? user.id : null,
        name: data.name || (user ? user.name : 'Anonymous'),
        mobile: data.mobile,
        amount: data.amount,
        txId: data.txId,
        method: data.method,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Donation submitted successfully. It will be verified by an admin shortly.',
      donation: {
        id: newDonation.id,
        status: newDonation.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[DONATION_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
