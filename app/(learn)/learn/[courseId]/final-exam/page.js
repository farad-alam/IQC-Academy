import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { redirect, notFound } from 'next/navigation';
import FinalExamClient from './FinalExamClient';

export const dynamic = 'force-dynamic';

export default async function CourseFinalExamPage({ params }) {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const resolvedParams = await params;
  const id = resolvedParams.id;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      finalExamQuizzes: true
    }
  });

  if (!course || !course.finalExamEnabled) {
    notFound();
  }

  // Get previous history for this course final exam
  const history = await prisma.finalExamSession.findMany({
    where: { userId: user.id, courseId: id },
    orderBy: { attemptNum: 'desc' },
    take: 5
  });

  const passedSession = history.find(h => h.passed);

  const unattemptedQuizzes = course.finalExamQuizzes;
  const shuffled = unattemptedQuizzes.sort(() => 0.5 - Math.random());
  const displayCount = course.finalExamDisplayCount || 20;
  const selectedQuizzes = shuffled.slice(0, displayCount);

  if (selectedQuizzes.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '600px' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <h2 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>কুইজ পাওয়া যায়নি</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>এই কোর্সের ফাইনাল পরীক্ষার জন্য এখনও কোনো প্রশ্ন যোগ করা হয়নি।</p>
          <a href={`/courses/${course.id}`} className="btn btn-primary">কোর্সে ফিরে যান</a>
        </div>
      </div>
    );
  }

  // Remove answers before sending to client
  const safeQuizzes = selectedQuizzes.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  return <FinalExamClient course={course} quizzes={safeQuizzes} history={history} alreadyPassed={!!passedSession} />;
}
