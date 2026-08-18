import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { z } from 'zod';
import crypto from 'crypto';
import argon2 from 'argon2';
import { sendAdminInviteEmail } from '@/lib/email';

// Validation schema for creating a new admin
const inviteAdminSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
  mobile: z.string().regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, 'সঠিক মোবাইল নম্বর দিন'),
});

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, admins });
  } catch (error) {
    console.error('[GET_ADMINS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = inviteAdminSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 });
    }

    const { name, email, mobile } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { mobile }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: `এই ${existingUser.email === email ? 'ইমেইল' : 'মোবাইল নম্বর'} দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে।` 
      }, { status: 409 });
    }

    // Generate a secure random password (approx 12 characters)
    const randomPassword = crypto.randomBytes(9).toString('base64');
    
    // Hash the password
    const passwordHash = await argon2.hash(randomPassword);

    // Create the admin user
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        passwordHash,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        createdAt: true,
      }
    });

    // Send the invitation email in the background (fire and forget)
    sendAdminInviteEmail(email, name, randomPassword).catch(console.error);

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (error) {
    console.error('[CREATE_ADMIN_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
