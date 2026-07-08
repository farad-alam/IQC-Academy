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

  if (user.status !== 'ACTIVE') {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary)' }}>অনুমোদনের অপেক্ষায়</h1>
        <p style={{ maxWidth: '500px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
          আপনার অ্যাকাউন্টটি বর্তমানে এডমিনের অনুমোদনের অপেক্ষায় রয়েছে। একাউন্ট অনুমোদিত হওয়ার পর আপনি কোর্সে ভর্তি হতে পারবেন। অনুমোদন সম্পন্ন হলে আপনাকে ইমেইলের মাধ্যমে জানানো হবে।
        </p>
      </div>
    );
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
