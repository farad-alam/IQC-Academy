import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { checkRateLimit } from '@/lib/middleware/withRateLimit';

export async function POST(req, { params }) {
  try {
    const { id: batchId } = await params;

    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimit = await checkRateLimit(`batch_join_${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // 2. Verify Session
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Validate Batch
    const batch = await prisma.batch.findUnique({
      where: { id: batchId }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found.' }, { status: 404 });
    }

    if (batch.status !== 'ENROLLING') {
      return NextResponse.json(
        { error: 'This batch is not currently accepting registrations.' },
        { status: 403 }
      );
    }

    // 4. Check if already enrolled
    const existingEnrollment = await prisma.batchStudent.findUnique({
      where: { batchId_userId: { batchId, userId: user.id } }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'You are already enrolled in this batch.' }, { status: 409 });
    }

    // 5. Enroll User
    await prisma.batchStudent.create({
      data: { batchId, userId: user.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully joined ${batch.name}!`,
      batchName: batch.name
    }, { status: 201 });

  } catch (error) {
    console.error('[BATCH_JOIN_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
