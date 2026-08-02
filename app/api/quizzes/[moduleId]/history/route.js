import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function GET(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { moduleId } = resolvedParams;

    const history = await prisma.moduleQuizSession.findMany({
      where: { userId: user.id, moduleId },
      orderBy: { attemptNum: 'desc' },
      take: 5 // Get last 5 attempts
    });

    return NextResponse.json({ success: true, history });

  } catch (error) {
    console.error('[GET_QUIZ_HISTORY_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
