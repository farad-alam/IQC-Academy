import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { redirect } from 'next/navigation';
import ContentClient from './ContentClient';

export const dynamic = 'force-dynamic';

export default async function ContentPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const user = await getAuthUser();
  if (!user) redirect('/login');
  
  // Fetch module from DB
  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      subject: { 
        include: { 
          course: { select: { id: true, title: true } }
        } 
      },
      quizzes: { select: { id: true } }
    }
  });

  if (!module || !module.subject || !module.subject.course) redirect('/courses');

  const courseId = module.subject.course.id;

  // Verify user is enrolled (directly or via batch) and active
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: courseId } }
  });

  const batchAccess = await prisma.batchCourse.findFirst({
    where: {
      courseId,
      batch: {
        students: { some: { userId: user.id } },
        status: { in: ['ACTIVE', 'ENROLLING'] }
      }
    }
  });

  if ((!enrollment || enrollment.status !== 'ACTIVE') && !batchAccess) {
    redirect(`/courses/${courseId}`);
  }

  // Fetch all modules for this course in sequential order
  const allModules = await prisma.module.findMany({
    where: { subject: { courseId: courseId } },
    include: { subject: true, _count: { select: { quizzes: true } } },
  });
  
  // Sort them manually: first by subject order, then by module order
  allModules.sort((a, b) => {
    if (a.subject.order !== b.subject.order) return a.subject.order - b.subject.order;
    return a.order - b.order;
  });

  const currentIndex = allModules.findIndex(m => m.id === id);

  // --- MODULE LOCK LOGIC ---
  if (currentIndex > 0) {
    const prevModule = allModules[currentIndex - 1];
    
    if (prevModule._count.quizzes > 0) {
      const passedQuiz = await prisma.moduleQuizSession.findFirst({
        where: { userId: user.id, moduleId: prevModule.id, passed: true }
      });
      if (!passedQuiz) {
        redirect(`/quiz/${prevModule.id}?locked=true`);
      }
    } else {
      const prevCompletion = await prisma.moduleCompletion.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId: prevModule.id } }
      });
      if (!prevCompletion) {
        redirect(`/content/${prevModule.id}`);
      }
    }
  }

  // Check if current module is already completed by user
  const completion = await prisma.moduleCompletion.findUnique({
    where: { userId_moduleId: { userId: user.id, moduleId: id } }
  });

  const isCompleted = !!completion;
  const hasQuiz = module.quizzes.length > 0;
  
  let quizPassed = false;
  if (hasQuiz) {
    const passedSession = await prisma.moduleQuizSession.findFirst({
      where: { userId: user.id, moduleId: id, passed: true }
    });
    quizPassed = !!passedSession;
  }

  // Find the next module in the sequence for navigation
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

  return (
    <ContentClient 
      module={module} 
      isCompleted={isCompleted} 
      hasQuiz={hasQuiz} 
      quizPassed={quizPassed}
      nextModuleId={nextModule?.id || null} 
    />
  );
}
