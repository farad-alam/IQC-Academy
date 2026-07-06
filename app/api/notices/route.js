import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req) {
  try {
    // 1. Fetch active notices
    // Only return notices where expiresAt is null or in the future
    const notices = await prisma.notice.findMany({
      where: {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      select: {
        id: true,
        title: true,
        body: true,
        link: true,
        linkText: true,
        important: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, notices });

  } catch (error) {
    console.error('[GET_NOTICES_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
