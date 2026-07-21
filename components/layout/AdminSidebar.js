'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, GraduationCap, Gift, Layers, Bell, LogOut, Target, Image as ImageIcon, Menu } from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navItems = [
    { name: 'ড্যাশবোর্ড', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'ব্যবহারকারী', href: '/admin/users', icon: Users },
    { name: 'কোর্সসমূহ', href: '/admin/courses', icon: GraduationCap },
    { name: 'ডোনেশন', href: '/admin/donations', icon: Gift },
    { name: 'প্রজেক্টস', href: '/admin/projects', icon: Target },
    { name: 'গ্যালারি', href: '/admin/gallery', icon: ImageIcon },
    { name: 'নোটিশ', href: '/admin/notices', icon: Bell },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const getPageTitle = () => {
    const item = navItems.find(i => pathname.startsWith(i.href));
    return item ? item.name : 'IQC Admin';
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className={styles.mobileTopBar}>
        <button className={styles.hamburgerBtn} onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
        <span className={styles.mobileTitle}>{getPageTitle()}</span>
      </div>

      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`} 
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
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
    </>
  );
}
