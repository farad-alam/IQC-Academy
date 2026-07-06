import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'FREE' or 'PAID'
    
    const whereClause = { status: 'PUBLISHED' };
    if (type === 'FREE' || type === 'PAID') {
      whereClause.type = type;
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        price: true,
        originalPrice: true,
        level: true,
        duration: true,
        language: true,
        coverGradient: true,
        coverImageUrl: true,
        rating: true,
        ratingCount: true,
        enrolledCount: true,
        instructor: {
          select: {
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, courses });

  } catch (error) {
    console.error('[GET_COURSES_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
