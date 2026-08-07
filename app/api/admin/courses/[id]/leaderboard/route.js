import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// GET - calculate leaderboard for a course
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;

    // Get all subjects in this course
    const subjects = await prisma.subject.findMany({
      where: { courseId, finalExamEnabled: true },
      select: { id: true, title: true, finalExamPassMark: true },
      orderBy: { order: 'asc' }
    });

    // Get all final exam sessions for these subjects
    const subjectIds = subjects.map(s => s.id);
    const sessions = await prisma.subjectFinalExamSession.findMany({
      where: { subjectId: { in: subjectIds } },
      include: {
        user: { select: { id: true, name: true, email: true, mobile: true } }
      }
    });

    // Get viva scores for this course
    const vivaScores = await prisma.vivaScore.findMany({
      where: { courseId }
    });

    // Build leaderboard: group by user, sum scores per subject
    const userMap = new Map();

    for (const session of sessions) {
      const uid = session.userId;
      if (!userMap.has(uid)) {
        userMap.set(uid, {
          user: session.user,
          subjectScores: {},
          totalExamScore: 0,
          vivaMarks: 0,
          grandTotal: 0
        });
      }
      // One attempt only — just take the score
      const entry = userMap.get(uid);
      entry.subjectScores[session.subjectId] = {
        score: session.score,
        total: session.total,
        passed: session.passed
      };
      entry.totalExamScore += session.score;
    }

    // Add viva scores
    for (const viva of vivaScores) {
      if (userMap.has(viva.userId)) {
        userMap.get(viva.userId).vivaMarks = viva.marks;
        userMap.get(viva.userId).grandTotal = userMap.get(viva.userId).totalExamScore + viva.marks;
      }
    }

    // For users with no viva, grandTotal = totalExamScore
    for (const [, entry] of userMap) {
      if (!entry.grandTotal) entry.grandTotal = entry.totalExamScore;
    }

    // Sort by totalExamScore (without viva) and grandTotal (with viva)
    const leaderboard = Array.from(userMap.values());
    const withoutViva = [...leaderboard].sort((a, b) => b.totalExamScore - a.totalExamScore)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    const withViva = [...leaderboard].sort((a, b) => b.grandTotal - a.grandTotal)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    return NextResponse.json({ subjects, withoutViva, withViva });
  } catch (error) {
    console.error('[ADMIN_LEADERBOARD_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
