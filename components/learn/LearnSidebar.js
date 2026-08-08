'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, GraduationCap, User, LogOut, ChevronLeft, Menu } from 'lucide-react';
import styles from './LearnSidebar.module.css';

export default function LearnSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.profile);
        }
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { name: 'ড্যাশবোর্ড', href: '/dashboard', icon: LayoutDashboard },
    { name: 'আমার ব্যাচসমূহ', href: '/my-batches', icon: GraduationCap },
    { name: 'আমার কোর্সসমূহ', href: '/my-courses', icon: BookOpen },
    { name: 'প্রোফাইল', href: '/profile', icon: User },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={closeSidebar} />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoArea}>
          <Link href="/dashboard" onClick={closeSidebar} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.75rem', lineHeight: 1 }}>🕌</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--color-primary-dark)', letterSpacing: '1px' }}>IQC</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '1px' }}>ACADEMY</span>
            </div>
          </Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={closeSidebar}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>অন্যান্য</div>
            <Link href="/" className={styles.navItem} onClick={closeSidebar}>
              <ChevronLeft size={20} />
              <span>মূল ওয়েবসাইটে ফিরুন</span>
            </Link>
            <button 
              onClick={handleLogout} 
              className={styles.navItem} 
              style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--color-error)' }}
            >
              <LogOut size={20} />
              <span>লগআউট</span>
            </button>
          </div>
        </nav>

      </aside>
    </>
  );
}
