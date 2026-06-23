'use client';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.topSection}>
          <p className={styles.subscribeText}>
            Sign up to receive our updates, or to stay up to date<br />
            on information about our courses.
          </p>
          <form className={styles.subscribeForm} onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="First name" className={styles.input} />
            <input type="text" placeholder="Last name" className={styles.input} />
            <input type="email" placeholder="Email" className={styles.input} />
            <button type="submit" className={styles.submitBtn}>Submit</button>
          </form>
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
