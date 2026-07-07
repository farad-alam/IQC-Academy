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
        role: true,
        status: true,
        totalPoints: true,
        currentStreak: true,
        createdAt: true,
        enrollments: {
          orderBy: { enrolledAt: 'desc' },
          select: {
            id: true,
            status: true,
            progress: true,
            completedModules: true,
            enrolledAt: true,
            completedAt: true,
            course: {
              select: {
                id: true,
                title: true,
                level: true,
                duration: true,
                type: true,
                _count: { select: { modules: true } },
                instructor: { select: { name: true } }
              }
            }
          }
        },
        donations: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            amount: true,
            method: true,
            txId: true,
            status: true,
            createdAt: true,
            project: { select: { title: true } }
          }
        },
      }
    });

    const activeEnrollments = profile.enrollments.filter(e => e.status === 'ACTIVE');
    const completedEnrollments = profile.enrollments.filter(e => e.status === 'COMPLETED');

    const formattedProfile = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      whatsapp: profile.whatsapp,
      facebook: profile.facebook,
      avatarUrl: profile.avatarUrl,
      institution: profile.institution,
      division: profile.division,
      district: profile.district,
      upazila: profile.upazila,
      role: profile.role,
      status: profile.status,
      totalPoints: profile.totalPoints,
      currentStreak: profile.currentStreak,
      joinedDate: profile.createdAt.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      coursesEnrolled: activeEnrollments.length,
      coursesCompleted: completedEnrollments.length,
      enrollments: profile.enrollments.map(e => ({
        ...e,
        amount: undefined, // not on enrollment
      })),
      donations: profile.donations.map(d => ({
        ...d,
        amount: Number(d.amount),
      })),
    };

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
