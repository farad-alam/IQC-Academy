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

  // --- STAGE 1: Module info & History (Parallel) ---
  const [module, history] = await Promise.all([
    prisma.module.findUnique({
      where: { id },
      include: {
        subject: { select: { course: { select: { id: true, title: true } } } },
        quizzes: { select: { id: true, question: true, options: true } } // Slim fetch!
      }
    }),
    prisma.moduleQuizSession.findMany({
      where: { userId: user.id, moduleId: id },
      orderBy: { attemptNum: 'desc' },
      take: 5
    })
  ]);

  if (!module || !module.subject || !module.subject.course) redirect('/courses');

  const courseId = module.subject.course.id;

  // --- STAGE 2: Course Modules (for lock check) ---
  const allModules = await prisma.module.findMany({
    where: { subject: { courseId } },
    select: { 
      id: true, 
      order: true, 
      subjectId: true, 
      subject: { select: { order: true } }, 
      _count: { select: { quizzes: true } } 
    }
  });
  
  allModules.sort((a, b) => {
    if (a.subject.order !== b.subject.order) return a.subject.order - b.subject.order;
    return a.order - b.order;
  });

  const currentIndex = allModules.findIndex(m => m.id === id);

  // --- STAGE 3: Lock Check Query ---
  let lockResult = null;
  if (currentIndex > 0) {
    const prevModule = allModules[currentIndex - 1];
    
    if (prevModule._count.quizzes > 0) {
      lockResult = await prisma.moduleQuizSession.findFirst({
        where: { userId: user.id, moduleId: prevModule.id, passed: true },
        select: { id: true }
      }).then(r => ({ type: 'quiz', passed: !!r, prevModuleId: prevModule.id }));
    } else {
      lockResult = await prisma.moduleCompletion.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId: prevModule.id } },
        select: { id: true }
      }).then(r => ({ type: 'completion', done: !!r, prevModuleId: prevModule.id }));
    }
  }

  // --- Apply Lock Redirects ---
  if (lockResult) {
    if (lockResult.type === 'quiz' && !lockResult.passed) {
      redirect(`/quiz/${lockResult.prevModuleId}?locked=true`);
    }
    if (lockResult.type === 'completion' && !lockResult.done) {
      redirect(`/content/${lockResult.prevModuleId}`);
    }
  }

  const passedSession = history.find(h => h.passed);

  const unattemptedQuizzes = module.quizzes; // Safe because we excluded correct/explanation in DB select
  const shuffled = unattemptedQuizzes.sort(() => 0.5 - Math.random());
  const displayCount = module.quizDisplayCount || 20;
  const safeQuizzes = shuffled.slice(0, displayCount);

  if (safeQuizzes.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '600px' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>সব কুইজ সম্পন্ন</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>আপনি ইতিমধ্যে এই মডিউলের সমস্ত কুইজ সম্পন্ন করেছেন। নতুন কোনো কুইজ নেই।</p>
          <a href={`/learn/${courseId}`} className="btn btn-primary">কোর্সে ফিরে যান</a>
        </div>
      </div>
    );
  }

  return <QuizClient module={module} quizzes={safeQuizzes} history={history} isLocked={isLocked} alreadyPassed={!!passedSession} />;
}
