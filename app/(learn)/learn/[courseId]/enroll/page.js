import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { redirect } from 'next/navigation';
import EnrollmentForm from './EnrollmentForm';
import { getSiteSettings } from '@/lib/siteSettings';

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
          আপনার অ্যাকাউন্টটি বর্তমানে এডমিনের অনুমোদনের অপেক্ষায় রয়েছে। একাউন্ট অনুমোদিত হওয়ার পর আপনি কোর্সে ভর্তি হতে পারবেন।
        </p>
      </div>
    );
  }

  const resolvedParams = await params;
  const id = resolvedParams.courseId || resolvedParams.id;

  const course = await prisma.course.findUnique({
    where: { id }
  });

  if (!course) {
    redirect('/dashboard');
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } }
  });

  if (existingEnrollment) {
    redirect(`/learn/${course.id}`);
  }

  // Check payment status (pending or rejected donation)
  let initialPaymentStatus = null;
  if (course.type === 'PAID') {
    const donation = await prisma.donation.findFirst({
      where: { userId: user.id, courseId: course.id },
      orderBy: { createdAt: 'desc' }
    });
    if (donation) {
      initialPaymentStatus = {
        status: donation.status,
        donation: {
          id: donation.id,
          amount: Number(donation.amount),
          method: donation.method,
          txId: donation.txId,
          mobile: donation.mobile,
          rejectionReason: donation.rejectionReason,
        }
      };
    }
  }

  const settings = await getSiteSettings(['bkash_number', 'nagad_number', 'rocket_number', 'contact_phone']);

  return <EnrollmentForm course={course} settings={settings} initialPaymentStatus={initialPaymentStatus} />;
}
