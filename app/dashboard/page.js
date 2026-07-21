'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Gift, Star, Zap, CheckCircle, Clock, ArrowRight,
  Bell, AlertTriangle, User, LogOut, ChevronRight, Flame
} from 'lucide-react';
import Loader from '@/components/ui/Loader';
import styles from './dashboard.module.css';

// ─── Status badge helper ─────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    PENDING: { label: 'অনুমোদন অপেক্ষায়', color: '#f59e0b', bg: '#fffbeb' },
    ACTIVE:  { label: 'সক্রিয়', color: '#16a34a', bg: '#f0fdf4' },
    BANNED:  { label: 'ব্যান করা হয়েছে', color: '#ef4444', bg: '#fef2f2' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40`, padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: bg, color }}>
        {icon}
      </div>
      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/users/me').then(r => r.json()),
      fetch('/api/notices').then(r => r.json()),
    ])
      .then(([userData, noticeData]) => {
        if (!userData.success) { router.push('/login'); return; }
        setUser(userData.profile);
        setNotices(noticeData.notices || noticeData || []);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader variant="section" text="লোড হচ্ছে..." />
          <p style={{ color: 'var(--color-text-muted)' }}>ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const activeEnrollments = user.enrollments?.filter(e => e.status === 'ACTIVE') || [];
  const completedEnrollments = user.enrollments?.filter(e => e.status === 'COMPLETED') || [];

  // Profile completion check
  const requiredFields = ['name', 'email', 'mobile', 'institution', 'division', 'district'];
  const filledFields = requiredFields.filter(f => user[f]);
  const profileCompletion = Math.round((filledFields.length / requiredFields.length) * 100);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── Welcome Header ──────────────────────────────────────────── */}
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeBg} />
          <div className={styles.welcomeContent}>
            <div className={styles.welcomeLeft}>
              <div className={styles.welcomeAvatar}>
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt={user.name} className={styles.welcomeAvatarImg} />
                  : <div className={styles.welcomeAvatarInitial}>{user.name?.charAt(0)?.toUpperCase()}</div>
                }
              </div>
              <div>
                <h1 className={styles.welcomeTitle}>
                  আস-সালামু আলাইকুম, {user.name.split(' ')[0]}! 👋
                </h1>
                <p className={styles.welcomeSub}>
                  {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <StatusBadge status={user.status} />
                  {user.currentStreak > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem' }}>
                      <Flame size={14} /> {user.currentStreak} দিনের স্ট্রিক
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.welcomeActions}>
              <Link href="/profile" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} style={{ marginRight: '8px' }} /> প্রোফাইল
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.7)', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogOut size={18} style={{ marginRight: '8px' }} /> লগআউট
              </button>
            </div>
          </div>
        </div>

        {/* ── Pending approval warning ────────────────────────────────── */}
        {user.status === 'PENDING' && (
          <div className={styles.alertBanner}>
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>আপনার অ্যাকাউন্ট অনুমোদনের অপেক্ষায় আছে।</strong>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>অ্যাডমিন অনুমোদন দিলে আপনি কোর্সে ভর্তি হতে পারবেন।</p>
            </div>
          </div>
        )}

        {/* ── Quick Stats ──────────────────────────────────────────────── */}
        <div className={styles.statsGrid}>
          <StatCard icon={<Star size={22} />} label="মোট পয়েন্ট" value={user.totalPoints ?? 0} color="#f59e0b" bg="#fffbeb" />
          <StatCard icon={<BookOpen size={22} />} label="চলমান কোর্স" value={activeEnrollments.length} color="#3b82f6" bg="#eff6ff" />
          <StatCard icon={<CheckCircle size={22} />} label="সম্পন্ন কোর্স" value={completedEnrollments.length} color="#16a34a" bg="#f0fdf4" />
          <StatCard icon={<Gift size={22} />} label="মোট অনুদান" value={user.donations?.length ?? 0} color="#8b5cf6" bg="#f5f3ff" />
        </div>

        <div className={styles.mainGrid}>

          {/* ── Left Column ─────────────────────────────────────────────── */}
          <div className={styles.leftCol}>

            {/* Enrolled Courses */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}><BookOpen size={18} /> আমার কোর্সসমূহ</h2>
                <Link href="/courses" className={styles.seeAll}>সব দেখুন <ArrowRight size={14} /></Link>
              </div>

              {activeEnrollments.length === 0 ? (
                <div className={styles.emptyState}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                  <p>আপনি এখনো কোনো কোর্সে ভর্তি হননি।</p>
                  <Link href="/courses" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                    কোর্স দেখুন
                  </Link>
                </div>
              ) : (
                <div className={styles.courseList}>
                  {activeEnrollments.map(enrollment => {
                    const course = enrollment.course;
                    const totalModules = course._count?.modules || 1;
                    const completed = enrollment.completedModules || 0;
                    const progress = Math.min(100, Math.round((completed / totalModules) * 100));

                    return (
                      <Link key={enrollment.id} href={`/courses/${course.id}`} className={styles.courseCard}>
                        <div className={styles.courseCardLeft}>
                          <div className={styles.courseIcon}>
                            <BookOpen size={22} />
                          </div>
                          <div className={styles.courseInfo}>
                            <h3 className={styles.courseTitle}>{course.title}</h3>
                            <p className={styles.courseMeta}>
                              <Clock size={12} /> {course.duration}
                              <span>•</span> {course.level}
                              <span>•</span> {course.instructor?.name || 'IQC Academy'}
                            </p>
                            <div className={styles.progressWrapper}>
                              <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                              </div>
                              <span className={styles.progressLabel}>{progress}%</span>
                            </div>
                            <span className={styles.moduleMeta}>{completed} / {totalModules} মডিউল সম্পন্ন</span>
                          </div>
                        </div>
                        <ChevronRight size={18} className={styles.courseArrow} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Donations */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}><Gift size={18} /> আমার অনুদান</h2>
                <Link href="/donate" className={styles.seeAll}>নতুন দান <ArrowRight size={14} /></Link>
              </div>

              {(!user.donations || user.donations.length === 0) ? (
                <div className={styles.emptyState}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💝</div>
                  <p>আপনি এখনো কোনো অনুদান করেননি।</p>
                  <Link href="/projects" className="btn btn-accent btn-sm" style={{ marginTop: '1rem' }}>
                    প্রজেক্ট দেখুন
                  </Link>
                </div>
              ) : (
                <div className={styles.donationList}>
                  {user.donations.map(d => (
                    <div key={d.id} className={styles.donationItem}>
                      <div>
                        <span className={styles.donationAmount}>৳{d.amount.toLocaleString('bn-BD')}</span>
                        <span className={styles.donationMeta}>{d.method} • {d.project?.title || 'সাধারণ ফান্ড'}</span>
                        <span className={styles.donationDate}>
                          {new Date(d.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <span className={`badge ${d.status === 'VERIFIED' ? 'badge-success' : d.status === 'PENDING' ? 'badge-warning' : 'badge-earth'}`}>
                        {d.status === 'VERIFIED' ? 'যাচাইকৃত' : d.status === 'PENDING' ? 'অপেক্ষমাণ' : 'বাতিল'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column ─────────────────────────────────────────────── */}
          <div className={styles.rightCol}>

            {/* Profile Completion */}
            {profileCompletion < 100 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}><Zap size={18} /> প্রোফাইল সম্পন্ন করুন</h2>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>প্রোফাইল সম্পন্নতা</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{profileCompletion}%</strong>
                  </div>
                  <div style={{ height: '8px', background: 'var(--color-earth-2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${profileCompletion}%`, background: 'var(--color-primary)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  পূর্ণ প্রোফাইল পয়েন্ট অর্জনে সাহায্য করে।
                </p>
                <Link href="/profile" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  প্রোফাইল সম্পাদনা করুন
                </Link>
              </div>
            )}

            {/* Notices */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}><Bell size={18} /> নোটিশ বোর্ড</h2>
              </div>
              {notices.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '1rem 0' }}>কোনো নোটিশ নেই।</p>
              ) : (
                <div className={styles.noticeList}>
                  {notices.slice(0, 4).map(notice => (
                    <div key={notice.id} className={`${styles.noticeItem} ${notice.important ? styles.noticeImportant : ''}`}>
                      <div className={styles.noticeTitle}>
                        {notice.important && <span style={{ color: 'var(--color-error)', fontSize: '0.75rem', fontWeight: 700 }}>🔴 গুরুত্বপূর্ণ — </span>}
                        {notice.title}
                      </div>
                      <p className={styles.noticeBody}>{notice.body}</p>
                      {notice.link && (
                        <a href={notice.link} target="_blank" rel="noopener noreferrer" className={styles.noticeLink}>
                          {notice.linkText || 'বিস্তারিত দেখুন'} →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>দ্রুত লিংক</h2>
              <div className={styles.quickLinks}>
                {[
                  { href: '/courses', label: '📚 সব কোর্স', },
                  { href: '/projects', label: '🌟 প্রজেক্টসমূহ' },
                  { href: '/donate', label: '💝 অনুদান করুন' },
                  { href: '/profile', label: '👤 প্রোফাইল এডিট' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className={styles.quickLink}>
                    {l.label} <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
