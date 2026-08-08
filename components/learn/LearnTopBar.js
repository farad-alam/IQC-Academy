'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Bell, ChevronDown, LayoutDashboard, User, LogOut, BookOpen } from 'lucide-react';
import styles from './LearnTopBar.module.css';

export default function LearnTopBar({ title = "ড্যাশবোর্ড", onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Try to determine title from pathname if not explicitly provided
  let displayTitle = title;
  if (!title) {
    if (pathname.includes('/dashboard')) displayTitle = 'ড্যাশবোর্ড';
    else if (pathname.includes('/my-batches')) displayTitle = 'আমার ব্যাচসমূহ';
    else if (pathname.includes('/my-courses')) displayTitle = 'আমার কোর্সসমূহ';
    else if (pathname.includes('/profile')) displayTitle = 'প্রোফাইল';
    else if (pathname.includes('/learn')) displayTitle = 'লার্নিং স্পেস';
    else displayTitle = 'IQC Academy';
  }

  // Fetch current user
  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.success) setUser(data.profile);
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
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

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className={styles.title}>{displayTitle}</h1>
      </div>
      
      <div className={styles.right}>
        <button className={styles.iconButton} style={{ marginRight: '0.5rem' }}>
          <Bell size={20} />
        </button>

        {user && (
          <div className={styles.userMenuWrapper} ref={dropdownRef}>
            <button
              className={styles.avatarBtn}
              onClick={() => setDropdownOpen(p => !p)}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div className={styles.avatarCircle}>{avatarInitial}</div>
              )}
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
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div className={styles.dropdownAvatar}>{avatarInitial}</div>
                  )}
                  <div>
                    <div className={styles.dropdownName}>{user.name}</div>
                    <div className={styles.dropdownEmail}>{user.email}</div>
                  </div>
                </div>
                <div className={styles.dropdownDivider} />
                <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <LayoutDashboard size={16} /> ড্যাশবোর্ড
                </Link>
                <Link href="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <User size={16} /> প্রোফাইল
                </Link>
                <Link href="/my-courses" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <BookOpen size={16} /> আমার কোর্স
                </Link>
                <div className={styles.dropdownDivider} />
                <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                  <LogOut size={16} /> লগআউট
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
