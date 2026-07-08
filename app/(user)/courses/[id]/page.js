import prisma from '@/lib/db';
import Link from 'next/link';
import { ChevronLeft, Lock, CheckCircle2, PlayCircle, Award } from 'lucide-react';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: true,
      modules: { orderBy: { order: 'asc' } }
    }
  });

  if (!course) {
    notFound();
  }

  const user = await getAuthUser();
  
  let enrollment = null;
  let completedModuleIds = [];
  
  if (user) {
    enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } }
    });
    
    if (enrollment) {
      const completions = await prisma.moduleCompletion.findMany({
        where: { userId: user.id, moduleId: { in: course.modules.map(m => m.id) } }
      });
      completedModuleIds = completions.map(c => c.moduleId);
    }
  }

  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.status === 'COMPLETED';
  const progress = enrollment?.progress || 0;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <Link href="/courses" className="btn btn-ghost" style={{ padding: 0, marginBottom: '2rem' }}>
        <ChevronLeft size={20} /> সকল কোর্সে ফিরে যান
      </Link>

      <div className="card" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
        {/* Cover */}
        <div style={{ width: '100%', aspectRatio: '21/9', backgroundColor: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {course.coverImageUrl ? (
            <img src={course.coverImageUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '3rem' }}>🎓</span>
          )}
        </div>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="badge badge-earth">{course.level}</span>
            <span className="badge badge-earth">{course.duration}</span>
            {course.type === 'PAID' && <span className="badge badge-warning">পেইড</span>}
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>{course.title}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{course.description}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
            <strong>ইন্সট্রাক্টর:</strong> {course.instructor?.name || 'IQC Academy'}
          </div>

          {!isEnrolled ? (
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface-alt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                {course.type === 'PAID' ? (
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-latin)' }}>৳{course.price?.toString()}</div>
                ) : (
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)' }}>সম্পূর্ণ ফ্রি</div>
                )}
              </div>
              
              {!user ? (
                <Link href={`/login?next=/courses/${course.id}`} className="btn btn-outline">
                  লগইন করুন
                </Link>
              ) : user.status === 'PENDING' ? (
                <span className="badge badge-warning" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  অনুমোদনের অপেক্ষায় ⏳
                </span>
              ) : (
                <Link href={`/courses/${course.id}/enroll`} className={course.type === 'PAID' ? 'btn btn-accent' : 'btn btn-primary'}>
                  {course.type === 'PAID' ? 'ভর্তি হোন' : 'কোর্স শুরু করুন'}
                </Link>
              )}
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
              {isCompleted && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', marginTop: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  <Award size={18} /> মাশাআল্লাহ! আপনি কোর্সটি সম্পন্ন করেছেন।
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modules */}
      <h2 className="section-title">কোর্স মডিউলসমূহ</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {course.modules?.length > 0 ? course.modules.map((module, idx) => {
          // A module is locked if the user is not enrolled and it's a paid course (or just not enrolled)
          // For simplicity, if not enrolled, all modules are locked.
          const isLocked = !isEnrolled;
          const isModuleCompleted = completedModuleIds.includes(module.id);
          
          return (
            <div 
              key={module.id} 
              className="card" 
              style={{ 
                padding: '1.25rem 1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                opacity: isLocked ? 0.6 : 1,
                border: isModuleCompleted ? '1px solid var(--color-success-bg)' : '1px solid var(--color-earth-1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%', 
                  backgroundColor: isModuleCompleted ? 'var(--color-success-bg)' : 'var(--color-surface-alt)',
                  color: isModuleCompleted ? 'var(--color-success)' : 'var(--color-text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontFamily: 'var(--font-latin)'
                }}>
                  {isModuleCompleted ? <CheckCircle2 size={20} /> : idx + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)' }}>{module.title}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {module.contentType === 'VIDEO' ? 'ভিডিও পাঠ' : module.contentType === 'PDF' ? 'পিডিএফ পাঠ' : 'টেক্সট পাঠ'}
                  </div>
                </div>
              </div>
              
              <div>
                {isLocked ? (
                  <Lock size={20} color="var(--color-text-light)" />
                ) : (
                  <Link href={`/content/${module.id}`} className="btn btn-outline btn-sm" style={{ padding: '6px 12px' }}>
                    {isModuleCompleted ? 'রিভিউ করুন' : 'শুরু করুন'} <PlayCircle size={16} />
                  </Link>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="empty-state">
            <p>এই কোর্সে এখনো কোনো মডিউল যোগ করা হয়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
}
