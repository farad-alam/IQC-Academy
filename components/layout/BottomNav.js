'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, GraduationCap, LayoutDashboard, User } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'হোম', href: '/', icon: Home },
    { name: 'ড্যাশবোর্ড', href: '/dashboard', icon: LayoutDashboard },
    { name: 'কোর্স', href: '/courses', icon: GraduationCap },
    { name: 'কন্টেন্ট', href: '/content', icon: BookOpen },
    { name: 'প্রোফাইল', href: '/profile', icon: User },
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {navItems.map((item) => {
          const Icon = item.icon;
          // Fix active state: exact match for root, startsWith for others
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href);
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <div className={styles.iconWrapper}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <div className={styles.activeIndicator} />}
              </div>
              <span className={styles.navLabel}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
