import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import LeaderboardClient from './LeaderboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminLeaderboardPage({ params }) {
  const { id: courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true, title: true } });
  if (!course) notFound();
  return <LeaderboardClient courseId={courseId} courseTitle={course.title} />;
}
