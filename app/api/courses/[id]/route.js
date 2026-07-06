import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const user = await getAuthUser();

    // 1. Fetch course basic info
    const course = await prisma.course.findUnique({
      where: { id, status: 'PUBLISHED' },
      include: {
        instructor: true,
        modules: {
          orderBy: { order: 'asc' },
          include: {
            quizzes: { select: { id: true } } // Just count/existence, not answers
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // 2. Check enrollment status
    let isEnrolled = false;
    let enrollment = null;
    let completedModules = [];

    if (user) {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: id,
          }
        }
      });

      if (enrollment && enrollment.status === 'ACTIVE') {
        isEnrolled = true;

        // Fetch completed modules for this user
        const completions = await prisma.moduleCompletion.findMany({
          where: {
            userId: user.id,
            moduleId: { in: course.modules.map(m => m.id) }
          },
          select: { moduleId: true }
        });
        completedModules = completions.map(c => c.moduleId);
      }
    }

    // 3. Filter module content if not enrolled
    const sanitizedModules = course.modules.map(module => {
      const isCompleted = completedModules.includes(module.id);
      
      if (!isEnrolled) {
        // Hide actual content body/urls for non-enrolled users
        return {
          id: module.id,
          title: module.title,
          order: module.order,
          duration: module.duration,
          contentType: module.contentType,
          hasQuiz: module.quizzes.length > 0,
          locked: true,
        };
      }

      // If enrolled, send full module content
      return {
        id: module.id,
        title: module.title,
        order: module.order,
        duration: module.duration,
        contentType: module.contentType,
        body: module.body,
        videoUrl: module.videoUrl,
        pdfUrl: module.pdfUrl,
        hasQuiz: module.quizzes.length > 0,
        locked: false,
        isCompleted
      };
    });

    const responseData = {
      ...course,
      modules: sanitizedModules,
      enrollmentStatus: isEnrolled ? 'ENROLLED' : 'NOT_ENROLLED',
      progress: enrollment ? enrollment.progress : 0
    };

    return NextResponse.json({ success: true, course: responseData });

  } catch (error) {
    console.error('[GET_COURSE_DETAIL_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
