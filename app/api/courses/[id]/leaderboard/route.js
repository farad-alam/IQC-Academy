import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export const dynamic = 'force-dynamic';

// GET /api/courses/[id]/leaderboard — authenticated students can view
export async function GET(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: courseId } = await params;

    const subjects = await prisma.subject.findMany({
      where: { courseId, finalExamEnabled: true },
      select: { id: true, title: true, finalExamPassMark: true },
      orderBy: { order: 'asc' }
    });

    const subjectIds = subjects.map(s => s.id);
    const sessions = await prisma.subjectFinalExamSession.findMany({
      where: { subjectId: { in: subjectIds } },
      include: { user: { select: { id: true, name: true } } }
    });

    const vivaScores = await prisma.vivaScore.findMany({ where: { courseId } });

    const userMap = new Map();
    for (const session of sessions) {
      const uid = session.userId;
      if (!userMap.has(uid)) {
        userMap.set(uid, { user: session.user, subjectScores: {}, totalExamScore: 0, vivaMarks: 0, grandTotal: 0 });
      }
      const entry = userMap.get(uid);
      entry.subjectScores[session.subjectId] = { score: session.score, total: session.total, passed: session.passed };
      entry.totalExamScore += session.score;
    }

    for (const viva of vivaScores) {
      if (userMap.has(viva.userId)) {
        userMap.get(viva.userId).vivaMarks = viva.marks;
        userMap.get(viva.userId).grandTotal = userMap.get(viva.userId).totalExamScore + viva.marks;
      }
    }
    for (const [, entry] of userMap) {
      if (!entry.grandTotal) entry.grandTotal = entry.totalExamScore;
    }

    const leaderboard = Array.from(userMap.values());
    const withViva = [...leaderboard].sort((a, b) => b.grandTotal - a.grandTotal)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    return NextResponse.json({ subjects, withViva });
  } catch (error) {
    console.error('[COURSE_LEADERBOARD_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
