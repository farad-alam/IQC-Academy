import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import SubjectFinalExamClient from './FinalExamClient';

export const dynamic = 'force-dynamic';

export default async function AdminSubjectFinalExamPage({ params }) {
  const { id: courseId, subjectId } = await params;
  const subject = await prisma.subject.findUnique({ where: { id: subjectId }, select: { id: true, title: true, courseId: true } });
  if (!subject || subject.courseId !== courseId) notFound();
  return <SubjectFinalExamClient courseId={courseId} subjectId={subjectId} subjectTitle={subject.title} />;
}
