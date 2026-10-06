import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: courseId } = await params;
    
    // Check access and leaderboardPublished
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { leaderboardPublished: true }
    });

    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    if (!course.leaderboardPublished) {
      return NextResponse.json({ published: false });
    }

    // Access control: admins, or users enrolled directly, or via batch
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    let hasAccess = isAdmin;
    
    if (!isAdmin) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } }
      });
      if (enrollment) {
        hasAccess = true;
      } else {
        const batchCourse = await prisma.batchCourse.findFirst({
          where: { courseId }
        });
        if (batchCourse) {
          const userInBatch = await prisma.batchStudent.findFirst({
            where: { batchId: batchCourse.batchId, userId: user.id }
          });
          if (userInBatch) hasAccess = true;
        }
      }
    }

    if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Include subjects with finalExamEnabled OR that have at least one session
    const allSubjects = await prisma.subject.findMany({
      where: { courseId },
      select: { id: true, title: true, finalExamEnabled: true, finalExamPassMark: true },
      orderBy: { order: 'asc' }
    });

    const subjectIds = allSubjects.map(s => s.id);
    const sessions = await prisma.subjectFinalExamSession.findMany({
      where: { subjectId: { in: subjectIds } },
      include: { user: { select: { id: true, name: true, role: true, status: true } } }
    });

    // Determine subjects to show
    const activeSubjectIds = new Set(allSubjects.filter(s => s.finalExamEnabled).map(s => s.id));
    for (const session of sessions) {
      activeSubjectIds.add(session.subjectId);
    }
    const subjects = allSubjects.filter(s => activeSubjectIds.has(s.id));

    const vivaScores = await prisma.vivaScore.findMany({ where: { courseId } });

    const userMap = new Map();
    for (const session of sessions) {
      // Filter out admins and banned users
      if (session.user.role !== 'STUDENT' || session.user.status === 'BANNED') continue;
      
      const uid = session.userId;
      if (!userMap.has(uid)) {
        userMap.set(uid, { 
          user: { id: session.user.id, name: session.user.name }, 
          subjectScores: {}, 
          totalExamScore: 0, 
          vivaMarks: 0, 
          grandTotal: 0,
          lastTakenAt: session.takenAt.getTime()
        });
      }
      const entry = userMap.get(uid);
      entry.subjectScores[session.subjectId] = { score: session.score, total: session.total, passed: session.passed };
      entry.totalExamScore += session.score;
      if (session.takenAt.getTime() > entry.lastTakenAt) {
        entry.lastTakenAt = session.takenAt.getTime();
      }
    }

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
    
    // Compute ranking with ties (Competition Ranking)
    // Primary sort: grandTotal desc, Secondary sort: lastTakenAt asc (earlier is better)
    const sorted = [...leaderboard].sort((a, b) => {
      if (b.grandTotal !== a.grandTotal) return b.grandTotal - a.grandTotal;
      return a.lastTakenAt - b.lastTakenAt;
    });

    let currentRank = 1;
    let rankOffset = 0;
    
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        if (curr.grandTotal === prev.grandTotal && curr.lastTakenAt === prev.lastTakenAt) {
          rankOffset++;
        } else {
          currentRank += rankOffset + 1;
          rankOffset = 0;
        }
      }
      sorted[i].rank = currentRank;
    }

    const myEntry = sorted.find(e => e.user.id === user.id);
    
    return NextResponse.json({ 
      published: true,
      subjects, 
      withViva: sorted,
      me: myEntry ? { userId: user.id, rank: myEntry.rank } : null,
      totalParticipants: sorted.length,
      maxTotal
    });
  } catch (error) {
    console.error('[COURSE_LEADERBOARD_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
