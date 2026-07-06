import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    const whereClause = {};
    if (type) {
      whereClause.type = type;
    }

    // 1. Fetch gallery items
    const items = await prisma.galleryItem.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        type: true,
        imageUrl: true,
        date: true,
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({ success: true, items });

  } catch (error) {
    console.error('[GET_GALLERY_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
