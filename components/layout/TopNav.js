'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, GraduationCap, User, Bell } from 'lucide-react';
import styles from './TopNav.module.css';

export default function TopNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'হোম', href: '/', icon: Home },
    { name: 'কন্টেন্ট', href: '/content', icon: BookOpen },
    { name: 'কোর্স', href: '/courses', icon: GraduationCap },
  ];

  return (
    <header className={styles.topNav}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logoArea}>
          <div className={styles.logoIcon}>📖</div>
          <span className={styles.logoText}>IQC Academy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
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
          <button className={styles.iconBtn} aria-label="Notifications">
            <Bell size={20} />
            <span className={styles.badge} />
          </button>
          
          <Link href="/profile" className={styles.profileBtn}>
            <div className={styles.avatar}>
              <User size={18} />
            </div>
            <span className={styles.userName}>প্রোফাইল</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
