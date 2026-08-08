import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { redirect } from 'next/navigation';
import QuizClient from './QuizClient';

export const dynamic = 'force-dynamic';

export default async function QuizPage({ params, searchParams }) {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const resolvedParams = await params;
  const id = resolvedParams.id;
  const resolvedSearchParams = await searchParams;
  const isLocked = resolvedSearchParams?.locked === 'true';

  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      quizzes: true,
      course: true
    }
  });

  // Get previous history for this module
  const history = await prisma.moduleQuizSession.findMany({
    where: { userId: user.id, moduleId: id },
    orderBy: { attemptNum: 'desc' },
    take: 5
  });

  const passedSession = history.find(h => h.passed);

  const unattemptedQuizzes = module.quizzes; // We don't exclude anymore, draw from full pool
  const shuffled = unattemptedQuizzes.sort(() => 0.5 - Math.random());
  const displayCount = module.quizDisplayCount || 20;
  const selectedQuizzes = shuffled.slice(0, displayCount);

  if (selectedQuizzes.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '600px' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>সব কুইজ সম্পন্ন</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>আপনি ইতিমধ্যে এই মডিউলের সমস্ত কুইজ সম্পন্ন করেছেন। নতুন কোনো কুইজ নেই।</p>
          <a href={`/courses/${module.courseId}`} className="btn btn-primary">কোর্সে ফিরে যান</a>
        </div>
      </div>
    );
  }

  const safeQuizzes = selectedQuizzes.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  return <QuizClient module={module} quizzes={safeQuizzes} history={history} isLocked={isLocked} alreadyPassed={!!passedSession} />;
}
