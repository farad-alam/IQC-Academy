'use client';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.contactSection}>
          <h3 className={styles.contactTitle}>যোগাযোগ</h3>
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

        <div className={styles.brandHuge}>
          <span>IQC</span>
          <span>Academy</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/courses" className={styles.navLink}>
          Courses
        </Link>
        <Link href="/projects" className={styles.navLink}>
          Projects
        </Link>
        <Link href="/madrasa" className={styles.navLink}>
          Madrasa
        </Link>
        <Link href="/donate" className={styles.navLink}>
          Donate
        </Link>
        
        <div className={styles.bottomRow}>
          <button className={styles.langBtn}>EN</button>
          <button className={styles.langBtn}>বাংলা</button>
        </div>
      </div>
    </footer>
  );
}
