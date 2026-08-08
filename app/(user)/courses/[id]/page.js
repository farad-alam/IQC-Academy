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

  const isEnrolled = !!enrollment;

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

          {/* Enroll / Go to Course block */}
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
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>আপনি এই কোর্সে যুক্ত আছেন</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>লার্নিং ড্যাশবোর্ড থেকে কোর্স চালিয়ে যান।</p>
              </div>
              <Link href={`/learn/${course.id}`} className="btn btn-primary">
                লার্নিং স্পেসে যান <ChevronRight size={16} style={{ marginLeft: '4px' }} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subjects → Modules Preview */}
      <h2 className="section-title">কোর্সের বিষয়সমূহ</h2>

      {course.subjects.length === 0 ? (
        <div className="empty-state"><p>এই কোর্সে এখনো কোনো বিষয় যোগ করা হয়নি।</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {course.subjects.map((subject, sIdx) => {
            return (
              <div key={subject.id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-surface))', borderBottom: '1px solid var(--color-earth-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontFamily: 'var(--font-latin)', flexShrink: 0 }}>
                      {sIdx + 1}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{subject.title}</h3>
                      {subject.description && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{subject.description}</p>}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {subject.modules.map((module, mIdx) => {
                    return (
                      <div key={module.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--color-surface-alt)', border: '1px solid var(--color-earth-1)', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-surface)', border: '2px solid var(--color-earth-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-latin)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', flexShrink: 0 }}>
                            {sIdx + 1}.{mIdx + 1}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{module.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              {module.contentType === 'VIDEO' ? '🎬 ভিডিও' : module.contentType === 'PDF' ? '📄 পিডিএফ' : '📝 পাঠ্য'}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Lock size={18} color="var(--color-text-light)" />
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
