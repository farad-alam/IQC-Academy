'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronRight, Clock } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import styles from '../dashboard/dashboard.module.css';

export default function MyCoursesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => {
        if (!data.success) { router.push('/login'); return; }
        setUser(data.profile);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader variant="section" text="লোড হচ্ছে..." />
          <p style={{ color: 'var(--color-text-muted)' }}>কোর্স লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayEnrollments = user.enrollments?.filter(e => e.status === 'ACTIVE' || e.status === 'COMPLETED') || [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
          <h1 className={styles.sectionTitle} style={{ fontSize: '1.5rem' }}>
            <BookOpen size={24} /> আমার কোর্সসমূহ
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            আপনি যে সকল কোর্সে এককভাবে এনরোল করেছেন সেগুলোর তালিকা
          </p>
        </div>

        {displayEnrollments.length === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <p>আপনি এখনো কোনো কোর্সে ভর্তি হননি।</p>
            <Link href="/courses" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              সকল কোর্স দেখুন
            </Link>
          </div>
        ) : (
          <div className={styles.courseList} style={{ gap: '1rem' }}>
            {displayEnrollments.map(enrollment => {
              const course = enrollment.course;
              const totalModules = course._count?.subjects || 1;
              const completed = enrollment.completedModules || 0;
              const isCompleted = enrollment.status === 'COMPLETED';
              const progress = isCompleted ? 100 : Math.min(100, Math.round((completed / totalModules) * 100));

              return (
                <Link key={enrollment.id} href={`/learn/${course.id}`} className={styles.courseCard} style={{ padding: '1.5rem' }}>
                  <div className={styles.courseCardLeft}>
                    <div className={styles.courseIcon} style={{ width: '60px', height: '60px', fontSize: '1.5rem', borderRadius: '12px' }}>
                      <BookOpen size={28} />
                    </div>
                    <div className={styles.courseInfo}>
                      <h3 className={styles.courseTitle} style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{course.title}</h3>
                      <p className={styles.courseMeta} style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                        <Clock size={14} /> {course.duration}
                        <span style={{ margin: '0 0.5rem' }}>•</span> {course.level}
                        <span style={{ margin: '0 0.5rem' }}>•</span> {course.instructor?.name || 'IQC Academy'}
                      </p>
                      <div className={styles.progressWrapper}>
                        <div className={styles.progressBar} style={{ height: '8px', borderRadius: '4px' }}>
                          <div className={styles.progressFill} style={{ width: `${progress}%`, borderRadius: '4px' }} />
                        </div>
                        <span className={styles.progressLabel} style={{ fontSize: '0.85rem' }}>{progress}%</span>
                      </div>
                      <span className={styles.moduleMeta} style={{ marginTop: '4px', display: 'inline-block' }}>
                        {completed}/{totalModules} মডিউল সম্পন্ন | বিষয়: {course._count?.subjects || 0}টি
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={24} className={styles.courseArrow} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
