import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandSection}>
            <div className={styles.logoArea}>
              <div className={styles.logoIcon}>📖</div>
              <span className={styles.logoText}>IQC Academy</span>
            </div>
            <p className={styles.description}>
              ইসলাম শেখার একটি আনন্দময় ও অনুপ্রেরণাদায়ক প্ল্যাটফর্ম। মানুষকে আনন্দের সাথে দ্বীন শেখানো ও দ্বীন শেখার প্রতি অনুপ্রাণিত করাই আমাদের লক্ষ্য।
            </p>
          </div>

          <div className={styles.linkSection}>
            <h3 className={styles.title}>গুরুত্বপূর্ণ লিংক</h3>
            <ul className={styles.linkList}>
              <li><Link href="/courses">কোর্সসমূহ</Link></li>
              <li><Link href="/madrasa">অনলাইন মাদ্রাসা</Link></li>
              <li><Link href="/projects">আমাদের প্রজেক্ট</Link></li>
              <li><Link href="/donate">ডোনেট করুন</Link></li>
            </ul>
          </div>

          <div className={styles.linkSection}>
            <h3 className={styles.title}>যোগাযোগ</h3>
            <ul className={styles.contactList}>
              <li>ইমেইল: info@iqcacademy.com</li>
              <li>মোবাইল: +880 1234 567890</li>
              <li>ঠিকানা: ঢাকা, বাংলাদেশ</li>
            </ul>
            <div className={styles.socials}>
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="YouTube">YT</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} IQC Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
