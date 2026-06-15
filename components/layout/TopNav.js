'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './TopNav.module.css';

export default function TopNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact us', href: '/contact' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <header className={styles.topNav}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logoArea}>
          <div className={styles.logoIcon}>🕌</div>
          <div className={styles.logoTextWrapper}>
            <span className={styles.logoTextWhite}>IQC</span>
            <span className={styles.logoTextYellow}>ACADEMY</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className={styles.actions}>
          <button className={styles.searchBtn} aria-label="Search">
            <Search size={20} />
          </button>
          
          <Link href="/courses" className={styles.exploreBtn}>
            Explore Courses
          </Link>
        </div>
      </div>
    </header>
  );
}
