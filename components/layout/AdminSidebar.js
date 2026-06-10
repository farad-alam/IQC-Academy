'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Gift, Layers, Bell, LogOut } from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'ড্যাশবোর্ড', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'ব্যবহারকারী', href: '/admin/users', icon: Users },
    { name: 'কন্টেন্ট', href: '/admin/content', icon: BookOpen },
    { name: 'কোর্সসমূহ', href: '/admin/courses', icon: GraduationCap },
    { name: 'ডোনেশন', href: '/admin/donations', icon: Gift },
    { name: 'ব্যাচ', href: '/admin/batches', icon: Layers },
    { name: 'নোটিশ', href: '/admin/notices', icon: Bell },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logoIcon}>📖</div>
        <div>
          <h2 className={styles.title}>IQC Academy</h2>
          <p className={styles.subtitle}>এডমিন প্যানেল</p>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Link href="/admin/login" className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>লগআউট</span>
        </Link>
      </div>
    </aside>
  );
}
