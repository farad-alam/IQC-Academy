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
      course: { select: { id: true, title: true } },
      quizzes: { select: { id: true } }
    }
  });

  if (!module) redirect('/courses');

  // Verify user is enrolled and active
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: module.courseId } }
  });

  if (!enrollment || enrollment.status !== 'ACTIVE') {
    redirect(`/courses/${module.courseId}`);
  }

  // Check if module is already completed by user
  const completion = await prisma.moduleCompletion.findUnique({
    where: { userId_moduleId: { userId: user.id, moduleId: id } }
  });

  const isCompleted = !!completion;
  const hasQuiz = module.quizzes.length > 0;

  // Find the next module in the sequence for navigation
  const nextModule = await prisma.module.findFirst({
    where: { 
      courseId: module.courseId, 
      order: { gt: module.order }
    },
    orderBy: { order: 'asc' }
  });

  return (
    <ContentClient 
      module={module} 
      isCompleted={isCompleted} 
      hasQuiz={hasQuiz} 
      nextModuleId={nextModule?.id} 
    />
  );
}
