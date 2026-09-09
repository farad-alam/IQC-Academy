import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { redirect } from 'next/navigation';
import ContentClient from './ContentClient';

export const dynamic = 'force-dynamic';

export default async function ContentPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // ── Auth check ────────────────────────────────────────────────────────────
  const user = await getAuthUser();
  if (!user) redirect('/login');
  
  // ── Fetch module + enrollment check in parallel ───────────────────────────
  // Previously these were 5 sequential queries (~10s). Now they run together.
  const [module, enrollment, batchAccess] = await Promise.all([
    prisma.module.findUnique({
      where: { id },
      include: {
        subject: { 
          include: { 
            course: { select: { id: true, title: true } }
          } 
        },
        quizzes: { select: { id: true } }
      }
    }),
    // We don't have courseId yet, so these will be re-run below if module exists.
    // Placeholder — resolved after module is fetched.
    Promise.resolve(null),
    Promise.resolve(null),
  ]);

  if (!module || !module.subject || !module.subject.course) redirect('/courses');

  const courseId = module.subject.course.id;

  // ── Enrollment + module list in parallel ──────────────────────────────────
  const [enrollmentResult, batchAccessResult, allModules] = await Promise.all([
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } }
    }),
    prisma.batchCourse.findFirst({
      where: {
        courseId,
        batch: {
          students: { some: { userId: user.id } },
          status: { in: ['ACTIVE', 'ENROLLING'] }
        }
      },
      select: { id: true } // only need to know if it exists
    }),
    prisma.module.findMany({
      where: { subject: { courseId } },
      include: { subject: { select: { order: true } }, _count: { select: { quizzes: true } } },
      orderBy: { order: 'asc' },
    }),
  ]);

  if ((!enrollmentResult || enrollmentResult.status !== 'ACTIVE') && !batchAccessResult) {
    redirect(`/courses/${courseId}`);
  }

  // Sort: by subject order first, then module order
  allModules.sort((a, b) => {
    if (a.subject.order !== b.subject.order) return a.subject.order - b.subject.order;
    return a.order - b.order;
  });

  const currentIndex = allModules.findIndex(m => m.id === id);

  // ── Module lock + completion check in parallel ────────────────────────────
  // Build all needed queries upfront, resolve together.
  const lockQuery = currentIndex > 0 ? (() => {
    const prevModule = allModules[currentIndex - 1];
    if (prevModule._count.quizzes > 0) {
      return prisma.moduleQuizSession.findFirst({
        where: { userId: user.id, moduleId: prevModule.id, passed: true },
        select: { id: true }
      }).then(r => ({ type: 'quiz', passed: !!r, prevModuleId: prevModule.id }));
    } else {
      return prisma.moduleCompletion.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId: prevModule.id } },
        select: { id: true }
      }).then(r => ({ type: 'completion', done: !!r, prevModuleId: prevModule.id }));
    }
  })() : Promise.resolve(null);

  const hasQuiz = module.quizzes.length > 0;

  const [lockResult, completion, quizSession] = await Promise.all([
    lockQuery,
    prisma.moduleCompletion.findUnique({
      where: { userId_moduleId: { userId: user.id, moduleId: id } },
      select: { id: true }
    }),
    hasQuiz
      ? prisma.moduleQuizSession.findFirst({
          where: { userId: user.id, moduleId: id, passed: true },
          select: { id: true }
        })
      : Promise.resolve(null),
  ]);

  // ── Apply lock redirects ──────────────────────────────────────────────────
  if (lockResult) {
    if (lockResult.type === 'quiz' && !lockResult.passed) {
      redirect(`/quiz/${lockResult.prevModuleId}?locked=true`);
    }
    if (lockResult.type === 'completion' && !lockResult.done) {
      redirect(`/content/${lockResult.prevModuleId}`);
    }
  }

  const isCompleted = !!completion;
  const quizPassed = !!quizSession;
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

  return (
    <ContentClient 
      module={module} 
      isCompleted={isCompleted} 
      hasQuiz={hasQuiz} 
      quizPassed={quizPassed}
      nextModuleId={nextModule?.id || null} 
    />
  );
}
