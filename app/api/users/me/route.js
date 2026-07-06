import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { profileUpdateSchema } from '@/lib/validation/user.schema';

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        whatsapp: true,
        facebook: true,
        avatarUrl: true,
        institution: true,
        division: true,
        district: true,
        upazila: true,
        totalPoints: true,
        currentStreak: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: { where: { status: 'ACTIVE' } },
          }
        },
        enrollments: {
          where: { status: 'COMPLETED' },
          select: { id: true }
        }
      }
    });

    // Formatting data to match what the frontend expects
    const formattedProfile = {
      ...profile,
      coursesEnrolled: profile._count.enrollments,
      coursesCompleted: profile.enrollments.length,
      joinedDate: profile.createdAt.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    delete formattedProfile.createdAt;
    delete formattedProfile._count;
    delete formattedProfile.enrollments;

    return NextResponse.json({ success: true, profile: formattedProfile });

  } catch (error) {
    console.error('[GET_PROFILE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = profileUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 });
    }

    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: result.data,
      select: {
        name: true,
        facebook: true,
        institution: true,
        division: true,
        district: true,
        upazila: true,
      }
    });

    return NextResponse.json({ success: true, profile: updatedProfile });

  } catch (error) {
    console.error('[PATCH_PROFILE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
