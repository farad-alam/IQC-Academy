'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, ChevronRight, BookOpen, Clock, XCircle, CreditCard } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import styles from '../dashboard/dashboard.module.css';

export default function MyBatchesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Map of courseId → payment status
  const [paymentStatuses, setPaymentStatuses] = useState({});

  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.json())
      .then(async data => {
        if (!data.success) { router.push('/login'); return; }
        setUser(data.profile);

        // Collect all PAID course IDs from batches
        const paidCourseIds = [];
        for (const bs of data.profile.batchStudents || []) {
          for (const bc of bs.batch.courses || []) {
            if (bc.course.type === 'PAID') {
              paidCourseIds.push(bc.course.id);
            }
          }
        }

        // Fetch payment status for each paid course
        if (paidCourseIds.length > 0) {
          const statuses = {};
          await Promise.all(paidCourseIds.map(async (courseId) => {
            try {
              const res = await fetch(`/api/courses/${courseId}/payment-status`);
              if (res.ok) {
                const d = await res.json();
                statuses[courseId] = d;
              }
            } catch {}
          }));
          setPaymentStatuses(statuses);
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader variant="section" text="লোড হচ্ছে..." />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const myBatches = user.batchStudents || [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
          <h1 className={styles.sectionTitle} style={{ fontSize: '1.5rem' }}>
            <GraduationCap size={24} /> আমার ব্যাচসমূহ
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            আপনি যে সকল ব্যাচে ভর্তি হয়েছেন সেগুলোর তালিকা
          </p>
        </div>

        {myBatches.length === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
            <p>আপনি এখনো কোনো ব্যাচে ভর্তি হননি।</p>
            <Link href="/batches" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              উন্মুক্ত ব্যাচসমূহ দেখুন
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {myBatches.map(bs => {
              const batch = bs.batch;
              const isLocked = batch.coursesLocked;

              return (
                <div key={bs.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                  <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-surface))', borderBottom: '1px solid var(--color-earth-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{batch.name}</h2>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        ভর্তির তারিখ: {new Date(bs.enrolledAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <span className={`badge ${batch.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                      {batch.status === 'ACTIVE' ? 'চলমান' : batch.status === 'COMPLETED' ? 'সম্পন্ন' : batch.status === 'ENROLLING' ? 'ভর্তি চলছে' : 'আপকামিং'}
                    </span>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1rem', fontWeight: 600, textTransform: 'uppercase' }}>ব্যাচের কোর্সসমূহ</h3>

                    {batch.courses.length === 0 ? (
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>এই ব্যাচে এখনো কোনো কোর্স যোগ করা হয়নি।</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {batch.courses.map(bc => {
                          const course = bc.course;
                          const ps = paymentStatuses[course.id];
                          const isPaid = course.type === 'PAID';
                          const isEnrolled = ps?.status === 'ENROLLED';
                          const isPending = ps?.status === 'PENDING';
                          const isRejected = ps?.status === 'REJECTED';

                          return (
                            <div key={bc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '10px', background: 'var(--color-surface-alt)', border: '1px solid var(--color-earth-1)', gap: '1rem', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {course.coverImageUrl ? (
                                  <img src={course.coverImageUrl} alt={course.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📚</div>
                                )}
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>{course.title}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', marginTop: '2px', flexWrap: 'wrap' }}>
                                    <span>{course.level}</span>
                                    <span>•</span>
                                    <span>{course.duration}</span>
                                    {isPaid && !isEnrolled && (
                                      <span style={{ color: '#d97706', fontWeight: 600 }}>• পেইড কোর্স</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action button based on state */}
                              <div>
                                {isLocked ? (
                                  <span style={{ fontSize: '0.85rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-error-bg, #fef2f2)', padding: '6px 12px', borderRadius: '6px' }}>
                                    <Lock size={16} /> কোর্স লক করা
                                  </span>
                                ) : isPaid && !isEnrolled && isPending ? (
                                  <span style={{ fontSize: '0.85rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', padding: '6px 12px', borderRadius: '6px', border: '1px solid #fcd34d', fontWeight: 600 }}>
                                    <Clock size={16} /> যাচাইয়ের অপেক্ষায়
                                  </span>
                                ) : isPaid && !isEnrolled && isRejected ? (
                                  <Link href={`/learn/${course.id}/enroll`} style={{ fontSize: '0.85rem', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', background: '#dc2626', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
                                    <XCircle size={16} /> প্রত্যাখ্যাত — পুনরায় করুন
                                  </Link>
                                ) : isPaid && !isEnrolled ? (
                                  <Link href={`/learn/${course.id}/enroll`} style={{ fontSize: '0.85rem', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', background: '#d97706', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
                                    <CreditCard size={16} /> পেমেন্ট করুন
                                  </Link>
                                ) : (
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <Link href={`/learn/${course.id}/leaderboard`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem', color: 'var(--color-primary)' }}>
                                      🏆 লিডারবোর্ড
                                    </Link>
                                    <Link href={`/learn/${course.id}`} className="btn btn-outline btn-sm" style={{ padding: '0.4rem 1rem' }}>
                                      কোর্স দেখুন <ChevronRight size={16} />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
