'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, LayoutDashboard, User, LogOut, BookOpen, Bell } from 'lucide-react';
import styles from './TopNav.module.css';

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { name: 'হোম', href: '/' },
    { name: 'কোর্সসমূহ', href: '/courses' },
    { name: 'প্রজেক্ট', href: '/projects' },
    { name: 'আমাদের সম্পর্কে', href: '/about' },
    { name: 'যোগাযোগ', href: '/contact' },
  ];

  // ── Fetch current auth state ────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/users/me', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.success) setUser(data.profile);
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, [pathname]); // re-check on route change

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const avatarInitial = user?.name?.charAt(0)?.toUpperCase() || '?';
  const dashboardHref = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

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
          {authLoading ? (
            <div className={styles.authSkeleton} />
          ) : user ? (
            /* ── Logged In: Avatar dropdown ── */
            <div className={styles.userMenuWrapper} ref={dropdownRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => setDropdownOpen(p => !p)}
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                <div className={styles.avatarCircle}>{avatarInitial}</div>
                <span className={styles.avatarName}>{user.name.split(' ')[0]}</span>
                <ChevronDown
                  size={16}
                  className={styles.chevron}
                  style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                />
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>{avatarInitial}</div>
                    <div>
                      <div className={styles.dropdownName}>{user.name}</div>
                      <div className={styles.dropdownEmail}>{user.email}</div>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link href={dashboardHref} className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={16} /> ড্যাশবোর্ড
                  </Link>
                  <Link href="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <User size={16} /> প্রোফাইল
                  </Link>
                  <Link href="/courses" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <BookOpen size={16} /> আমার কোর্স
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                    <LogOut size={16} /> লগআউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Logged Out: Login + Register buttons ── */
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginBtn}>
                লগইন
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                রেজিস্ট্রেশন
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
