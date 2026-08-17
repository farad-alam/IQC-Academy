'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, GraduationCap, Gift, Layers, Bell, LogOut, Target, Image as ImageIcon, Menu, Settings, Home, Users2, Shield } from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Fetch current user's role on mount
  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.json())
      .then(d => {
        if (d.success) setUserRole(d.profile.role);
      })
      .catch(err => console.error("Failed to fetch role", err));
  }, []);

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
    { name: 'ব্যাচ', href: '/admin/batches', icon: Users2 },
    { name: 'কোর্সসমূহ', href: '/admin/courses', icon: GraduationCap },
    { name: 'শিক্ষকসমূহ', href: '/admin/instructors', icon: Users },
    { name: 'ডোনেশন', href: '/admin/donations', icon: Gift },
    { name: 'প্রজেক্টস', href: '/admin/projects', icon: Target },
    { name: 'গ্যালারি', href: '/admin/gallery', icon: ImageIcon },
    { name: 'নোটিশ', href: '/admin/notices', icon: Bell },
    { name: 'এডমিন ম্যানেজ', href: '/admin/admins', icon: Shield, superAdminOnly: true },
    { name: 'সেটিংস', href: '/admin/settings', icon: Settings, superAdminOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.superAdminOnly || userRole === 'SUPER_ADMIN');


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
          {visibleNavItems.map((item) => {
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
          
          <Link href="/" className={styles.navItem} style={{ marginTop: '0.5rem', color: 'var(--color-primary)' }}>
            <Home size={20} />
            <span>হোম পেজে যান</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
