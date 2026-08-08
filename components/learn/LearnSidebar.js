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
    { name: 'আমার ব্যাচসমূহ', href: '/batches', icon: GraduationCap },
    { name: 'আমার কোর্সসমূহ', href: '/courses', icon: BookOpen },
    { name: 'প্রোফাইল', href: '/profile', icon: User },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={closeSidebar} />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoArea}>
          <Link href="/" onClick={closeSidebar} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img src="/images/logo.png" alt="IQC Academy" style={{ height: '32px' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>IQC Academy</span>
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

        {user && (
          <div className={styles.userArea}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className={styles.avatar} style={{ objectFit: 'cover' }} />
            ) : (
              <div className={styles.avatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userPoints}>{user.totalPoints || 0} পয়েন্ট</div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
