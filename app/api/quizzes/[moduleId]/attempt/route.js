import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { quizAttemptSchema } from '@/lib/validation/user.schema';

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params;
    const { moduleId } = resolvedParams;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate body
    const body = await req.json();
    if (!Array.isArray(body)) {
        return NextResponse.json({ error: 'Expected array of answers' }, { status: 400 });
    }

    // Verify enrollment
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { quizzes: true }
    });

    if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: module.courseId } }
    });

    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Not actively enrolled' }, { status: 403 });
    }

    // Max Attempts Logic
    // In a real app, you might check how many attempts user made for this module's quizzes
    
    let score = 0;
    const results = [];

    // Calculate the next attempt number for each quiz
    const quizIds = module.quizzes.map(q => q.id);
    const lastAttempts = await prisma.quizAttempt.groupBy({
      by: ['quizId'],
      where: { userId: user.id, quizId: { in: quizIds } },
      _max: { attemptNum: true }
    });
    
    const maxAttemptMap = {};
    for (const la of lastAttempts) {
      maxAttemptMap[la.quizId] = la._max.attemptNum || 0;
    }

    // Evaluate answers
    for (const item of body) {
      const { quizId, answer } = item;
      const parsed = quizAttemptSchema.safeParse({ answer });
      if (!parsed.success) continue;

      const quiz = module.quizzes.find(q => q.id === quizId);
      if (!quiz) continue;

      const passed = quiz.correct === answer;
      if (passed) score++;

      results.push({
        quizId,
        passed,
        correctAnswer: quiz.correct,
        explanation: quiz.explanation
      });

      const attemptNum = (maxAttemptMap[quizId] || 0) + 1;

      // Record attempt
      await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          quizId,
          answer,
          passed,
          attemptNum
        }
      });
    }

    const totalQuestions = module.quizzes.length;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    const passedModule = percentage >= 80; // Example threshold

    // If passed, add points
    if (passedModule) {
      await prisma.user.update({
        where: { id: user.id },
        data: { totalPoints: { increment: 50 } }
      });
    }

    return NextResponse.json({ 
      success: true, 
      score,
      totalQuestions,
      percentage,
      passedModule,
      results 
    });

  } catch (error) {
    console.error('[QUIZ_ATTEMPT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
