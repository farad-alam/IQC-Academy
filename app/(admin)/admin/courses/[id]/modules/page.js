import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import ModulesClient from './ModulesClient';

export const dynamic = 'force-dynamic';

export default async function AdminModulesPage({ params }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: { _count: { select: { quizzes: true } } }
      }
    }
  });

  if (!course) notFound();

  return <ModulesClient course={course} />;
}
