import { NextResponse } from 'next/server';
import { hash } from 'argon2';
import prisma from '@/lib/db';
import { batchRegisterSchema } from '@/lib/validation/auth.schema';
import { checkRateLimit } from '@/lib/middleware/withRateLimit';

export async function POST(req, { params }) {
  try {
    const { batchId } = await params;

    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimit = await checkRateLimit(`batch_register_${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // 2. Validate the batch exists and is accepting registrations
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { courses: { include: { course: { select: { id: true, title: true } } } } }
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

    // 3. Parse and Validate Body
    const body = await req.json();
    const result = batchRegisterSchema.safeParse(body);
    
    if (!result.success) {
      const formattedErrors = result.error.format();
      return NextResponse.json({ error: 'Validation failed', details: formattedErrors }, { status: 400 });
    }

    const data = result.data;

    // 4. Check for existing users
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { mobile: data.mobile }
        ]
      }
    });

    if (existingUser) {
      // If user already exists, just add them to the batch if not already in it
      const alreadyInBatch = await prisma.batchStudent.findUnique({
        where: { batchId_userId: { batchId, userId: existingUser.id } }
      });
      if (!alreadyInBatch) {
        await prisma.batchStudent.create({ data: { batchId, userId: existingUser.id } });
      }
      return NextResponse.json({ error: 'Email or Mobile number already exists.' }, { status: 409 });
    }

    // 5. Hash password
    const passwordHash = await hash(data.password);

    // 6. Create user (auto-ACTIVE) + assign to batch in one transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          whatsapp: data.whatsapp,
          facebook: data.facebook,
          passwordHash,
          institution: data.institution,
          division: data.division,
          district: data.district,
          upazila: data.upazila,
          dob: data.dob ? new Date(data.dob) : null,
          sscYear: data.sscYear,
          sscBoard: data.sscBoard,
          sscGpa: data.sscGpa,
          status: 'ACTIVE', // Auto-activated immediately
          role: 'STUDENT',
        },
        select: { id: true, name: true, email: true, status: true }
      });

      // Auto-assign to batch
      await tx.batchStudent.create({ data: { batchId, userId: user.id } });

      return user;
    });

    return NextResponse.json({ 
      success: true, 
      message: `Registration successful! You have been enrolled in ${batch.name}. You can now log in.`,
      user: newUser,
      batchName: batch.name
    }, { status: 201 });

  } catch (error) {
    console.error('[BATCH_REGISTER_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
