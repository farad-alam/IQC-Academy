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

  const moduleQuizIds = module.quizzes.map(q => q.id);
  const maxExamAttempt = await prisma.quizAttempt.aggregate({
    where: { userId: user.id, quizId: { in: moduleQuizIds } },
    _max: { attemptNum: true }
  });

  const currentAttemptCount = maxExamAttempt._max.attemptNum || 0;
  if (currentAttemptCount >= 3) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '600px' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <h2 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>সর্বোচ্চ সীমা অতিক্রান্ত</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>আপনি এই পরীক্ষার সর্বোচ্চ ৩টি সুযোগ ব্যবহার করেছেন।</p>
          <a href={`/courses/${module.courseId}`} className="btn btn-primary">কোর্সে ফিরে যান</a>
        </div>
      </div>
    );
  }

  const previousAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id, quizId: { in: moduleQuizIds } },
    select: { quizId: true }
  });
  const attemptedQuizIds = previousAttempts.map(a => a.quizId);

  const unattemptedQuizzes = module.quizzes.filter(q => !attemptedQuizIds.includes(q.id));
  const shuffled = unattemptedQuizzes.sort(() => 0.5 - Math.random());
  const selectedQuizzes = shuffled.slice(0, 20);

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

  return <QuizClient module={module} quizzes={safeQuizzes} />;
}
