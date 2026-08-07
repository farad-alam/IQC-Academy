import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import SubjectsClient from './SubjectsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSubjectsPage({ params }) {
  const { id: courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true, title: true } });
  if (!course) notFound();
  return <SubjectsClient courseId={courseId} courseTitle={course.title} />;
}
