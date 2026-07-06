import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { redirect } from 'next/navigation';
import EnrollmentForm from './EnrollmentForm';

export const dynamic = 'force-dynamic';

export default async function CourseEnrollmentPage({ params }) {
  const user = await getAuthUser();
  if (!user) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const course = await prisma.course.findUnique({
    where: { id }
  });

  if (!course) {
    redirect('/courses');
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } }
  });

  if (existingEnrollment) {
    redirect(`/courses/${course.id}`);
  }

  return <EnrollmentForm course={course} />;
}
