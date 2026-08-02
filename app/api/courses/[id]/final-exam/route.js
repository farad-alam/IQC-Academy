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
    const { id: courseId } = resolvedParams;

    // 1. Check Course settings and Enrollment
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: { _count: { select: { quizzes: true } } }
        }
      }
    });

    if (!course || !course.finalExamEnabled) {
      return NextResponse.json({ error: 'Final exam not available for this course' }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } }
    });

    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Not actively enrolled' }, { status: 403 });
    }

    // 2. Verify all modules are completed and quizzes passed
    const moduleIds = course.modules.map(m => m.id);
    
    // Check module completions
    const completions = await prisma.moduleCompletion.findMany({
      where: { userId: user.id, moduleId: { in: moduleIds } }
    });
    
    if (completions.length < moduleIds.length) {
      return NextResponse.json({ error: 'সকল মডিউল সম্পন্ন করতে হবে (Complete all modules first)' }, { status: 403 });
    }

    // Check module quiz passes (only for modules that have quizzes)
    const modulesWithQuizzes = course.modules.filter(m => m._count.quizzes > 0).map(m => m.id);
    if (modulesWithQuizzes.length > 0) {
      const passedSessions = await prisma.moduleQuizSession.findMany({
        where: { userId: user.id, moduleId: { in: modulesWithQuizzes }, passed: true }
      });
      
      // Extract unique passed module IDs
      const passedModuleIds = new Set(passedSessions.map(s => s.moduleId));
      
      if (passedModuleIds.size < modulesWithQuizzes.length) {
        return NextResponse.json({ error: 'সবগুলো মডিউলের কুইজ পাস করতে হবে (Pass all module quizzes first)' }, { status: 403 });
      }
    }

    // 3. Fetch Final Exam questions (without the correct answer)
    const allQuizzes = await prisma.finalExamQuiz.findMany({
      where: { courseId },
      select: {
        id: true,
        question: true,
        options: true,
        // INTENTIONALLY NOT SELECTING 'correct' OR 'explanation'
      }
    });

    if (allQuizzes.length === 0) {
      return NextResponse.json({ error: 'No questions available' }, { status: 404 });
    }

    // 4. Shuffle and pick finalExamDisplayCount
    const shuffled = allQuizzes.sort(() => 0.5 - Math.random());
    const displayCount = course.finalExamDisplayCount || 20;
    const selectedQuizzes = shuffled.slice(0, displayCount);

    return NextResponse.json({ success: true, quizzes: selectedQuizzes });

  } catch (error) {
    console.error('[GET_FINAL_EXAM_QUIZ_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
