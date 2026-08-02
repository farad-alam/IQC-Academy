import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { redirect } from 'next/navigation';
import FinalExamClient from './FinalExamClient';

export const dynamic = 'force-dynamic';

export default async function AdminFinalExamPage({ params }) {
  const admin = await getAuthUser();
  if (!admin || admin.role !== 'ADMIN') redirect('/login');

  const resolvedParams = await params;
  const { id: courseId } = resolvedParams;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      finalExamQuizzes: true
    }
  });

  if (!course) redirect('/admin/courses');

  return <FinalExamClient course={course} />;
}
