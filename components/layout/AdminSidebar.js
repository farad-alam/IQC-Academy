'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Gift, Layers, Bell, LogOut, Target } from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'ড্যাশবোর্ড', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'ব্যবহারকারী', href: '/admin/users', icon: Users },
    { name: 'কন্টেন্ট', href: '/admin/content', icon: BookOpen },
    { name: 'কোর্সসমূহ', href: '/admin/courses', icon: GraduationCap },
    { name: 'ডোনেশন', href: '/admin/donations', icon: Gift },
    { name: 'প্রজেক্টস', href: '/admin/projects', icon: Target },
    { name: 'নোটিশ', href: '/admin/notices', icon: Bell },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

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
        <button onClick={handleLogout} className={styles.logoutBtn} style={{ border: 'none', width: '100%', cursor: 'pointer', backgroundColor: 'transparent' }}>
          <LogOut size={20} />
          <span>লগআউট</span>
        </button>
      </div>
    </aside>
  );
}
