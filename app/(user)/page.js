'use client';
import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowRight, Heart, PlayCircle, Bell } from 'lucide-react';
import styles from './home.module.css';

export default function HomePage() {
  return (
    <div className={styles.home}>
      {/* Clean Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <div className={styles.badgePulse} />
            নতুন ব্যাচে ভর্তি চলছে
          </div>
          
          <h1 className={styles.title}>
            কুরআন ও সুন্নাহর <br />
            <span className={styles.titleHighlight}>আলোকে জীবন</span>
          </h1>
          
          <p className={styles.subtitle}>
            ইসলাম শেখার একটি আনন্দময়, সহজ ও অনুপ্রেরণাদায়ক প্ল্যাটফর্ম। 
            বিশুদ্ধ ইলম অর্জন করুন এবং নিজের জীবনকে আলোকিত করুন।
          </p>
          
          <div className={styles.heroActions}>
            <Link href="/courses" className={`btn btn-primary \${styles.primaryBtn}`}>
              কোর্সসমূহ শুরু করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>আমাদের সেবাসমূহ</h2>
          <p className={styles.sectionSubtitle}>আপনার দ্বীনি জ্ঞান অর্জনের জন্য প্রয়োজনীয় সবকিছু</p>
        </div>

        <div className={styles.bentoGrid}>
          
          {/* Courses - Wide Card */}
          <Link href="/courses" className={`\${styles.bentoCard} \${styles.bentoCourses}`}>
            <div className={styles.iconWrapper}>
              <GraduationCap size={32} />
            </div>
            <h3 className={styles.cardTitle}>সার্টিফিকেট কোর্স</h3>
            <p className={styles.cardDesc}>
              অভিজ্ঞ আলেমদের পরিচালনায় বিভিন্ন মেয়াদের ইসলামিক কোর্স। ধাপে ধাপে শিখুন এবং প্রতিটি কোর্স শেষে যাচাইয়ের মাধ্যমে সার্টিফিকেট অর্জন করুন।
            </p>
            <div className={styles.cardAction}>
              কোর্স এক্সপ্লোর করুন <ArrowRight size={16} />
            </div>
          </Link>

          {/* Madrasa - Square Card */}
          <Link href="/madrasa" className={`\${styles.bentoCard} \${styles.bentoMadrasa}`}>
            <div className={styles.iconWrapper}>
              <span style={{ fontSize: '1.8rem' }}>🕌</span>
            </div>
            <h3 className={styles.cardTitle}>অনলাইন মাদ্রাসা</h3>
            <p className={styles.cardDesc}>
              সিস্টেমেটিক সিলেবাস ভিত্তিক ইসলামিক পড়াশোনার সুযোগ।
            </p>
            <div className={styles.cardAction}>
              বিস্তারিত <ArrowRight size={16} />
            </div>
          </Link>

          {/* Content - Square Card */}
          <Link href="/content" className={`\${styles.bentoCard} \${styles.bentoContent}`}>
            <div className={styles.iconWrapper} style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
              <BookOpen size={32} />
            </div>
            <h3 className={styles.cardTitle}>আর্টিকেল ও ভিডিও</h3>
            <p className={styles.cardDesc}>
              কুরআন, হাদিস ও মাসআলা বিষয়ক জ্ঞানগর্ভ প্রবন্ধ ও ভিডিও লেকচার।
            </p>
            <div className={styles.cardAction}>
              পড়তে থাকুন <ArrowRight size={16} />
            </div>
          </Link>

          {/* Projects/Donation - Square Card */}
          <Link href="/projects" className={`\${styles.bentoCard} \${styles.bentoProjects}`}>
            <div className={styles.iconWrapper} style={{ backgroundColor: 'var(--color-accent-50)', color: 'var(--color-accent-dark)' }}>
              <Heart size={32} />
            </div>
            <h3 className={styles.cardTitle}>সদকাহ ও প্রজেক্ট</h3>
            <p className={styles.cardDesc}>
              আমাদের মানবিক ও দা'ওয়াহ কার্যক্রমে অংশগ্রহণ করে সওয়াবের অংশীদার হোন।
            </p>
            <div className={styles.cardAction}>
              অংশগ্রহণ করুন <ArrowRight size={16} />
            </div>
          </Link>

        </div>
      </section>

      {/* Featured Highlight */}
      <section className={styles.highlightSection}>
        <div className={styles.highlightCard}>
          <div className={styles.highlightContent}>
            <span className={styles.highlightBadge}>নতুন নোটিশ</span>
            <h2 className={styles.highlightTitle}>রমজান প্রস্তুতি কোর্স ২০২৬</h2>
            <p className={styles.highlightDesc}>
              রমজানের ফজিলত, মাসআলা এবং আমলের সঠিক নিয়ম জানতে আমাদের নতুন ফ্রি কোর্সে আজই যুক্ত হোন।
            </p>
          </div>
          <div>
            <Link href="/courses" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
              বিস্তারিত জানুন
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
