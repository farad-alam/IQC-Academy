import { NextResponse } from 'next/server';
import { hash } from 'argon2';
import prisma from '@/lib/db';
import { registerSchema } from '@/lib/validation/auth.schema';
import { checkRateLimit } from '@/lib/middleware/withRateLimit';
import { getSiteSettings } from '@/lib/siteSettings';

export async function POST(req) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimit = await checkRateLimit(`register_${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // 2. Check if individual registration is open
    const settings = await getSiteSettings(['individual_registration_open']);
    if (settings.individual_registration_open !== 'true') {
      return NextResponse.json(
        { error: 'Registration is currently closed. Please contact us for more information.' },
        { status: 403 }
      );
    }

    // 3. Parse and Validate Body
    const body = await req.json();
    const result = registerSchema.safeParse(body);
    
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
      return NextResponse.json({ error: 'Email or Mobile number already exists.' }, { status: 409 });
    }

    // 5. Hash password
    const passwordHash = await hash(data.password);

    // 6. Create user — auto-ACTIVE, no approval needed
    const newUser = await prisma.user.create({
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
        status: 'ACTIVE',
        role: 'STUDENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful. You can now log in.',
      user: newUser 
    }, { status: 201 });

  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
