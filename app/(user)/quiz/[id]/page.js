import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { redirect } from 'next/navigation';
import QuizClient from './QuizClient';

export const dynamic = 'force-dynamic';

export default async function QuizPage({ params }) {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const resolvedParams = await params;
  const id = resolvedParams.id;

  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      quizzes: true,
      course: true
    }
  });

  if (!module || module.quizzes.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>এই মডিউলে কোনো কুইজ নেই।</h2>
      </div>
    );
  }

  return <QuizClient module={module} quizzes={module.quizzes} />;
}
