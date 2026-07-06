import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { quizAttemptSchema } from '@/lib/validation/user.schema';

export async function POST(req, { params }) {
  try {
    const { moduleId } = params;
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

      // Record attempt (optional: getting latest attemptNum)
      // This is a simplified approach; usually you do this in a transaction
      await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          quizId,
          answer,
          passed,
          attemptNum: 1 // Simplified: hardcoding 1 for now, in prod you'd query max + 1
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
