import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: courseId } = await params;

    // Include subjects with finalExamEnabled OR that have at least one session
    const allSubjects = await prisma.subject.findMany({
      where: { courseId },
      select: { id: true, title: true, finalExamEnabled: true, finalExamPassMark: true },
      orderBy: { order: 'asc' }
    });

    const subjectIds = allSubjects.map(s => s.id);
    const sessions = await prisma.subjectFinalExamSession.findMany({
      where: { subjectId: { in: subjectIds } },
      include: {
        user: { select: { id: true, name: true, email: true, mobile: true, role: true, status: true } }
      }
    });

    // Determine subjects to show
    const activeSubjectIds = new Set(allSubjects.filter(s => s.finalExamEnabled).map(s => s.id));
    for (const session of sessions) {
      activeSubjectIds.add(session.subjectId);
    }
    const subjects = allSubjects.filter(s => activeSubjectIds.has(s.id));

    // Get viva scores for this course
    const vivaScores = await prisma.vivaScore.findMany({
      where: { courseId }
    });

    // Build leaderboard: group by user, sum scores per subject
    const userMap = new Map();

    for (const session of sessions) {
      // For admin we show everyone, but we might want to filter out admins? Let's just show everyone for now, or maybe exclude admins.
      if (session.user.role !== 'STUDENT') continue;
      
      const uid = session.userId;
      if (!userMap.has(uid)) {
        userMap.set(uid, {
          user: session.user,
          subjectScores: {},
          totalExamScore: 0,
          vivaMarks: 0,
          grandTotal: 0,
          lastTakenAt: session.takenAt.getTime()
        });
      }
      
      const entry = userMap.get(uid);
      entry.subjectScores[session.subjectId] = {
        score: session.score,
        total: session.total,
        passed: session.passed
      };
      entry.totalExamScore += session.score;
      if (session.takenAt.getTime() > entry.lastTakenAt) {
        entry.lastTakenAt = session.takenAt.getTime();
      }
    }

    // Add viva scores
    for (const viva of vivaScores) {
      if (userMap.has(viva.userId)) {
        userMap.get(viva.userId).vivaMarks = viva.marks;
      }
    }

    let maxTotal = 0;
    for (const [, entry] of userMap) {
      entry.grandTotal = entry.totalExamScore + entry.vivaMarks;
      let sessionTotal = 0;
      for (const subj of Object.values(entry.subjectScores)) {
        sessionTotal += subj.total;
      }
      if (sessionTotal > maxTotal) maxTotal = sessionTotal;
    }

    const leaderboard = Array.from(userMap.values());
    
    // Sort by totalExamScore (without viva)
    const withoutViva = [...leaderboard].sort((a, b) => {
      if (b.totalExamScore !== a.totalExamScore) return b.totalExamScore - a.totalExamScore;
      return a.lastTakenAt - b.lastTakenAt;
    });
    
    // Rank without viva
    let currentRankW = 1;
    let rankOffsetW = 0;
    for (let i = 0; i < withoutViva.length; i++) {
      if (i > 0) {
        const prev = withoutViva[i - 1];
        const curr = withoutViva[i];
        if (curr.totalExamScore === prev.totalExamScore && curr.lastTakenAt === prev.lastTakenAt) {
          rankOffsetW++;
        } else {
          currentRankW += rankOffsetW + 1;
          rankOffsetW = 0;
        }
      }
      withoutViva[i].rank = currentRankW;
    }

    // Sort by grandTotal (with viva)
    const withViva = [...leaderboard].sort((a, b) => {
      if (b.grandTotal !== a.grandTotal) return b.grandTotal - a.grandTotal;
      return a.lastTakenAt - b.lastTakenAt;
    });

    // Rank with viva
    let currentRankV = 1;
    let rankOffsetV = 0;
    for (let i = 0; i < withViva.length; i++) {
      if (i > 0) {
        const prev = withViva[i - 1];
        const curr = withViva[i];
        if (curr.grandTotal === prev.grandTotal && curr.lastTakenAt === prev.lastTakenAt) {
          rankOffsetV++;
        } else {
          currentRankV += rankOffsetV + 1;
          rankOffsetV = 0;
        }
      }
      withViva[i].rank = currentRankV;
    }

    return NextResponse.json({ subjects, withoutViva, withViva });
  } catch (error) {
    console.error('[ADMIN_LEADERBOARD_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
