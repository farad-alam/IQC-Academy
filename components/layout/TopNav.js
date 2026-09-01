'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, LayoutDashboard, User, LogOut, BookOpen } from 'lucide-react';
import styles from './TopNav.module.css';

const REG_STATUS_KEY = 'iqc:reg_status';
const REG_STATUS_TTL = 10 * 60 * 1000; // 10 minutes in ms

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { name: 'হোম', href: '/' },
    { name: 'কোর্সসমূহ', href: '/courses' },
    { name: 'ব্যাচে ভর্তি', href: '/batches' },
    { name: 'প্রজেক্ট', href: '/projects' },
    { name: 'আমাদের সম্পর্কে', href: '/about' },
    { name: 'যোগাযোগ', href: '/contact' },
  ];

  // ── Fetch auth state ONCE on mount ──────────────────────────────────────────
  // Removed [pathname] dependency — auth state does not change on navigation.
  // Using /api/users/me-minimal which returns only { name, email, role }
  // instead of the full /api/users/me which loads enrollments + donations + batches.
  useEffect(() => {
    // 1. Lightweight auth check — runs only once
    fetch('/api/users/me-minimal')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));

    // 2. Register-status: read from sessionStorage cache first (10-min TTL).
    // This setting changes very rarely — no need to hit DB on every navigation.
    try {
      const cached = sessionStorage.getItem(REG_STATUS_KEY);
      if (cached) {
        const { value, expiry } = JSON.parse(cached);
        if (Date.now() < expiry) {
          setRegistrationOpen(value);
          return; // cache hit — skip the fetch entirely
        }
      }
    } catch {
      // sessionStorage not available (e.g. some private browsing modes)
    }

    fetch('/api/auth/register-status')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setRegistrationOpen(data.open);
          // Cache the result for 10 minutes
          try {
            sessionStorage.setItem(REG_STATUS_KEY, JSON.stringify({
              value: data.open,
              expiry: Date.now() + REG_STATUS_TTL,
            }));
          } catch {
            // ignore if sessionStorage is unavailable
          }
        }
      })
      .catch(() => {});
  }, []); // ← empty dependency array: runs once on mount only

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
    // Clear cached register-status so next session gets a fresh value
    try { sessionStorage.removeItem(REG_STATUS_KEY); } catch {}
    router.push('/');
    router.refresh();
  };

  const avatarInitial = user?.name?.charAt(0)?.toUpperCase() || '?';
  const dashboardHref = (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN')
    ? '/admin/dashboard'
    : '/dashboard';

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
                  <Link href="/batches" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    🏫 ব্যাচে ভর্তি
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
              <Link href="/projects" className={styles.donateBtnNav}>
                <span className={styles.donateIcon}>❤️</span> দান করুন
              </Link>
              <Link href="/login" className={styles.loginBtn}>
                লগইন
              </Link>
              <Link href={registrationOpen ? "/register" : "/batches"} className={styles.registerBtn}>
                {registrationOpen ? "রেজিস্ট্রেশন" : "ব্যাচে ভর্তি"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
