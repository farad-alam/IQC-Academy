import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import SubjectModulesClient from './ModulesClient';

export const dynamic = 'force-dynamic';

export default async function AdminSubjectModulesPage({ params }) {
  const { id: courseId, subjectId } = await params;

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      modules: { orderBy: { order: 'asc' }, include: { _count: { select: { quizzes: true } } } }
    }
  });

  if (!subject || subject.courseId !== courseId) notFound();

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true, title: true } });

  return <SubjectModulesClient subject={subject} course={course} />;
}
