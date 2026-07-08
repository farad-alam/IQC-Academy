import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import QuizzesClient from './QuizzesClient';

export const dynamic = 'force-dynamic';

export default async function AdminQuizzesPage({ params }) {
  const resolvedParams = await params;
  const { id: courseId, moduleId } = resolvedParams;

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      quizzes: true,
      course: { select: { title: true } }
    }
  });

  if (!module) notFound();

  return <QuizzesClient module={module} courseId={courseId} />;
}
