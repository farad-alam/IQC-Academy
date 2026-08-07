import prisma from '@/lib/db';
import Link from 'next/link';
import { ChevronLeft, Lock, CheckCircle2, PlayCircle, Award, ClipboardList, ChevronDown, Trophy } from 'lucide-react';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: true,
      subjects: {
        orderBy: { order: 'asc' },
        include: {
          modules: {
            orderBy: { order: 'asc' },
            include: { _count: { select: { quizzes: true } } }
          },
          _count: { select: { finalExamQuizzes: true } }
        }
      }
    }
  });

  if (!course) notFound();

  const user = await getAuthUser();

  let enrollment = null;
  let completedModuleIds = [];
  let finalExamSessions = {};
  let batchLocked = false;

  if (user) {
    enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } }
    });

    // Check if this course is batch-locked for this user
    const batchCourse = await prisma.batchCourse.findFirst({
      where: { courseId: course.id },
      include: { batch: { select: { coursesLocked: true } } }
    });
    // Check if user is in that batch
    if (batchCourse) {
      const userInBatch = await prisma.batchStudent.findFirst({
        where: { batchId: batchCourse.batchId, userId: user.id }
      });
      if (userInBatch) batchLocked = batchCourse.batch.coursesLocked;
    }

    if (enrollment) {
      const allModuleIds = course.subjects.flatMap(s => s.modules.map(m => m.id));
      const completions = await prisma.moduleCompletion.findMany({
        where: { userId: user.id, moduleId: { in: allModuleIds } }
      });
      completedModuleIds = completions.map(c => c.moduleId);

      // Get subject final exam sessions
      const subjectIds = course.subjects.map(s => s.id);
      const sessions = await prisma.subjectFinalExamSession.findMany({
        where: { userId: user.id, subjectId: { in: subjectIds } }
      });
      sessions.forEach(s => { finalExamSessions[s.subjectId] = s; });
    }
  }

  const isEnrolled = !!enrollment;
  const progress = enrollment?.progress || 0;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '860px' }}>
      <Link href="/courses" className="btn btn-ghost" style={{ padding: 0, marginBottom: '2rem' }}>
        <ChevronLeft size={20} /> সকল কোর্সে ফিরে যান
      </Link>

      {/* Course Card */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ width: '100%', aspectRatio: '21/9', backgroundColor: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {course.coverImageUrl
            ? <img src={course.coverImageUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '3rem' }}>🎓</span>}
        </div>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="badge badge-earth">{course.level}</span>
            <span className="badge badge-earth">{course.duration}</span>
            {course.type === 'PAID' && <span className="badge badge-warning">পেইড</span>}
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>{course.title}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>{course.description}</p>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
            <strong>ইন্সট্রাক্টর:</strong> {course.instructor?.name || 'IQC Academy'}
          </div>

          {/* Batch locked notice */}
          {batchLocked && isEnrolled && (
            <div style={{ padding: '1rem 1.25rem', backgroundColor: '#fef9c3', border: '1px solid #fde047', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Lock size={20} color="#ca8a04" />
              <div>
                <strong style={{ color: '#92400e' }}>কোর্সটি এখনো লক করা আছে</strong>
                <p style={{ fontSize: '0.85rem', color: '#78350f', marginTop: '2px' }}>ব্যাচ শুরু হলে অ্যাডমিন কোর্সটি আনলক করবেন।</p>
              </div>
            </div>
          )}

          {/* Enroll / Progress block */}
          {!isEnrolled ? (
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface-alt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                {course.type === 'PAID'
                  ? <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-latin)' }}>৳{course.price?.toString()}</div>
                  : <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)' }}>সম্পূর্ণ ফ্রি</div>}
              </div>
              {!user
                ? <Link href={`/login?next=/courses/${course.id}`} className="btn btn-outline">লগইন করুন</Link>
                : <Link href={`/courses/${course.id}/enroll`} className={course.type === 'PAID' ? 'btn btn-accent' : 'btn btn-primary'}>
                    {course.type === 'PAID' ? 'ভর্তি হোন' : 'কোর্স শুরু করুন'}
                  </Link>}
            </div>
          ) : (
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--color-primary-dark)' }}>আপনার অগ্রগতি</span>
                <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-latin)' }}>{progress}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
                <Link href={`/courses/${course.id}/leaderboard`} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent-dark)', gap: '0.4rem' }}>
                  <Trophy size={15} /> লিডারবোর্ড
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subjects → Modules */}
      <h2 className="section-title">কোর্সের বিষয়সমূহ</h2>

      {course.subjects.length === 0 ? (
        <div className="empty-state"><p>এই কোর্সে এখনো কোনো বিষয় যোগ করা হয়নি।</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {course.subjects.map((subject, sIdx) => {
            const subjectModuleIds = subject.modules.map(m => m.id);
            const subjectCompletedCount = subjectModuleIds.filter(id => completedModuleIds.includes(id)).length;
            const subjectAllDone = subjectModuleIds.length > 0 && subjectCompletedCount === subjectModuleIds.length;
            const examSession = finalExamSessions[subject.id];
            const isLocked = !isEnrolled || batchLocked;

            return (
              <div key={subject.id} className="card" style={{ overflow: 'hidden' }}>
                {/* Subject header */}
                <div style={{ padding: '1.25rem 1.5rem', background: subjectAllDone ? 'linear-gradient(135deg, var(--color-success-bg), #f0fdf4)' : 'linear-gradient(135deg, var(--color-primary-50), var(--color-surface))', borderBottom: '1px solid var(--color-earth-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: subjectAllDone ? 'var(--color-success)' : 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontFamily: 'var(--font-latin)', flexShrink: 0 }}>
                      {subjectAllDone ? <CheckCircle2 size={20} /> : sIdx + 1}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{subject.title}</h3>
                      {subject.description && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{subject.description}</p>}
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                        {subjectCompletedCount}/{subject.modules.length} মডিউল সম্পন্ন
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {subject.finalExamEnabled && isEnrolled && !batchLocked && (
                      examSession ? (
                        <span style={{ padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: examSession.passed ? '#dcfce7' : '#fee2e2', color: examSession.passed ? '#16a34a' : '#dc2626' }}>
                          {examSession.passed ? '✅ পাস' : '❌ ফেইল'} ({examSession.score}/{examSession.total})
                        </span>
                      ) : subjectAllDone ? (
                        <Link href={`/courses/${course.id}/subjects/${subject.id}/final-exam`} className="btn btn-accent btn-sm">
                          <ClipboardList size={14} /> ফাইনাল পরীক্ষা
                        </Link>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Lock size={14} /> সব মডিউল শেষ করুন
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Modules */}
                <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {subject.modules.map((module, mIdx) => {
                    const isDone = completedModuleIds.includes(module.id);
                    return (
                      <div key={module.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '8px', background: isDone ? '#f0fdf4' : 'var(--color-surface-alt)', border: `1px solid ${isDone ? '#bbf7d0' : 'var(--color-earth-1)'}`, flexWrap: 'wrap', gap: '0.5rem', opacity: isLocked ? 0.6 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: isDone ? 'var(--color-success)' : 'var(--color-surface)', border: `2px solid ${isDone ? 'var(--color-success)' : 'var(--color-earth-1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-latin)', fontSize: '0.8rem', fontWeight: 700, color: isDone ? 'white' : 'var(--color-text-muted)', flexShrink: 0 }}>
                            {isDone ? <CheckCircle2 size={16} /> : `${sIdx + 1}.${mIdx + 1}`}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{module.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              {module.contentType === 'VIDEO' ? '🎬 ভিডিও' : module.contentType === 'PDF' ? '📄 পিডিএফ' : '📝 পাঠ্য'}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {isLocked ? <Lock size={18} color="var(--color-text-light)" /> : (
                            <>
                              <Link href={`/content/${module.id}`} className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem' }}>
                                {isDone ? 'রিভিউ' : 'শুরু'} <PlayCircle size={14} />
                              </Link>
                              {module._count?.quizzes > 0 && (
                                <Link href={`/quiz/${module.id}`} className="btn btn-accent btn-sm" style={{ fontSize: '0.8rem' }}>কুইজ</Link>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {subject.modules.length === 0 && <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', padding: '1rem' }}>এই বিষয়ে এখনো কোনো মডিউল নেই।</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
