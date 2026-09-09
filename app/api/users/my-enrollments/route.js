import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/middleware/withAuth';
import prisma from '@/lib/db';

// Lightweight enrollment list used by /courses client component.
// Returns only the fields needed to overlay enrollment badges on course cards.
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ enrollments: [] });

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      select: {
        courseId: true,
        status: true,
        progress: true,
        completedModules: true,
      }
    });

    return NextResponse.json({ enrollments });
  } catch {
    return NextResponse.json({ enrollments: [] });
  }
}
