'use client';
import Link from 'next/link';
import styles from './splash.module.css';

export default function SplashPage() {
  return (
    <main className={styles.splash}>
      {/* Islamic Pattern Background */}
      <div className={styles.patternOverlay} aria-hidden="true" />

      {/* Animated circles */}
      <div className={styles.circle1} aria-hidden="true" />
      <div className={styles.circle2} aria-hidden="true" />
      <div className={styles.circle3} aria-hidden="true" />

      <div className={styles.content}>
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>📖</span>
          </div>
          <div className={styles.logoBadge}>IQC</div>
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          <span className={styles.titleTop}>IQC Academy</span>
          <span className={styles.titleSub}>আই-কিউ-সি একাডেমি</span>
        </h1>

        {/* Arabic Quote */}
        <div className={styles.arabicQuote}>
          <p className={`font-arabic ${styles.arabicText}`}>
            ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ
          </p>
          <p className={styles.arabicTranslation}>
            "পড়ো তোমার প্রভুর নামে যিনি সৃষ্টি করেছেন" — সূরা আলাক: ১
          </p>
        </div>

        {/* Tagline */}
        <p className={styles.tagline}>
          ইসলাম শেখার একটি আনন্দময় ও অনুপ্রেরণাদায়ক প্ল্যাটফর্ম
        </p>

        {/* CTA Buttons */}
        <div className={styles.actions}>
          <Link href="/register" className={`btn btn-accent btn-lg ${styles.btnRegister}`} id="splash-register-btn">
            ✨ রেজিস্ট্রেশন করুন
          </Link>
          <Link href="/login" className={`btn btn-outline btn-lg ${styles.btnLogin}`} id="splash-login-btn">
            লগইন করুন
          </Link>
        </div>

        {/* Features */}
        <div className={styles.features}>
          {[
            { icon: '📚', label: 'কোর্স ও কন্টেন্ট' },
            { icon: '🕌', label: 'অনলাইন মাদ্রাসা' },
            { icon: '🎓', label: 'সার্টিফিকেট' },
          ].map((f) => (
            <div key={f.label} className={styles.featureItem}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <span className={styles.featureLabel}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom ornament */}
      <div className={styles.bottomOrnament} aria-hidden="true">
        <div className={styles.ornamentLine} />
        <span className={styles.ornamentStar}>✦</span>
        <div className={styles.ornamentLine} />
      </div>
    </main>
  );
}
