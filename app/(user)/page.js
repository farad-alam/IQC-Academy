'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockUser, mockSectionNav } from '@/lib/mockData';
import NoticeBoard from '@/components/features/NoticeBoard';
import ImageSlider from '@/components/features/ImageSlider';
import styles from './home.module.css';

export default function HomePage() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('শুভ সকাল');
    else if (hour >= 12 && hour < 17) setGreeting('শুভ দুপুর');
    else if (hour >= 17 && hour < 20) setGreeting('শুভ সন্ধ্যা');
    else setGreeting('শুভ রাত্রি');
  }, []);

  return (
    <div className={styles.home}>
      {/* Header Greeting */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <div>
              <p className={styles.greeting}>{greeting},</p>
              <h1 className={styles.name}>আসসালামু আলাইকুম, {mockUser.name.split(' ')[0]}</h1>
            </div>
            <div className={styles.streakBadge}>
              <span className={styles.streakIcon}>🔥</span>
              <span className={styles.streakCount}>{mockUser.currentStreak} দিন</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: '2rem' }}>
        {/* Banner/Slider */}
        <section className={styles.section}>
          <ImageSlider />
        </section>

        {/* Notice Board */}
        <section className={styles.section}>
          <NoticeBoard />
        </section>

        {/* Navigation Grid */}
        <section className={styles.section}>
          <h2 className="section-title">মেন্যু</h2>
          <div className={styles.navGrid}>
            {mockSectionNav.map((item) => (
              <Link 
                key={item.id} 
                href={item.href}
                className={styles.navCard}
              >
                <div 
                  className={styles.navIcon} 
                  style={{ backgroundColor: item.color + '15', color: item.color }}
                >
                  {item.icon}
                </div>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Progress Summary Widget */}
        <section className={styles.section}>
          <div className={styles.progressWidget}>
            <div className={styles.progressInfo}>
              <h3 className={styles.progressTitle}>আপনার অগ্রগতি</h3>
              <p className={styles.progressSub}>মাশাআল্লাহ, আপনি ভালো করছেন! চালিয়ে যান।</p>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{mockUser.coursesCompleted}</span>
                  <span className={styles.statLabel}>কোর্স সম্পন্ন</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{mockUser.coursesEnrolled}</span>
                  <span className={styles.statLabel}>চলমান কোর্স</span>
                </div>
              </div>
              <Link href="/profile" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                বিস্তারিত দেখুন
              </Link>
            </div>
            <div className={styles.progressRingWrapper}>
              {/* Circular Progress (Simplified for CSS) */}
              <div className={styles.progressCircle} style={{ '--progress': `${mockUser.overallProgress}%` }}>
                <div className={styles.progressInner}>
                  <span className={styles.progressValue}>{mockUser.overallProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
