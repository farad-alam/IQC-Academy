import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { notFound, redirect } from 'next/navigation';
import CertificateClient from './CertificateClient';

export const dynamic = 'force-dynamic';

export default async function CertificatePage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const user = await getAuthUser();
  
  if (!user) {
    redirect('/login');
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include: { instructor: true }
  });

  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } }
  });

  if (!enrollment || enrollment.status !== 'COMPLETED') {
    redirect(`/courses/${course.id}`);
  }

  // Generate unique certificate ID
  const certId = `IQC-${enrollment.id.substring(0, 8).toUpperCase()}`;

  return (
    <CertificateClient 
      user={user} 
      course={course} 
      enrollment={enrollment} 
      certId={certId} 
    />
  );
}
