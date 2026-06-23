'use client';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.topGrid}>
          {/* Column 1: Contact */}
          <div className={styles.gridItem}>
            <h3 className={styles.contactTitle}>যোগাযোগ</h3>
            <ul className={styles.contactList}>
              <li>ইমেইল: info@iqcacademy.com</li>
              <li>মোবাইল: +880 1234 567890</li>
              <li>ঠিকানা: ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>

          {/* Column 2: Social Media */}
          <div className={styles.gridItem}>
            <h3 className={styles.contactTitle}>সোশ্যাল মিডিয়া</h3>
            <div className={styles.socialsGrid}>
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="YouTube">YT</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Twitter">X</a>
            </div>
          </div>

          {/* Column 3: Google Maps */}
          <div className={`${styles.gridItem} ${styles.mapContainer}`}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.0369448503!2d90.3671072!3d23.74705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sDhanmondi%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1717600000000!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
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
