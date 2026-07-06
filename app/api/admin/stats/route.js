import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Gather stats in parallel
    const [
      totalUsers,
      totalStudents,
      pendingUsers,
      totalCourses,
      totalDonationsAmount,
      pendingDonations
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { status: 'PENDING' } }),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.donation.aggregate({ 
        where: { status: 'VERIFIED' },
        _sum: { amount: true } 
      }),
      prisma.donation.count({ where: { status: 'PENDING' } }),
    ]);

    return NextResponse.json({ 
      success: true, 
      stats: {
        totalUsers,
        totalStudents,
        pendingUsers,
        totalCourses,
        totalDonations: totalDonationsAmount._sum.amount || 0,
        pendingDonations,
      }
    });

  } catch (error) {
    console.error('[ADMIN_STATS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
