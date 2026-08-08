'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell } from 'lucide-react';
import styles from './LearnTopBar.module.css';

export default function LearnTopBar({ title = "ড্যাশবোর্ড", onMenuClick }) {
  const pathname = usePathname();
  
  // Try to determine title from pathname if not explicitly provided
  let displayTitle = title;
  if (!title) {
    if (pathname.includes('/dashboard')) displayTitle = 'ড্যাশবোর্ড';
    else if (pathname.includes('/batches')) displayTitle = 'আমার ব্যাচসমূহ';
    else if (pathname.includes('/courses')) displayTitle = 'আমার কোর্সসমূহ';
    else if (pathname.includes('/profile')) displayTitle = 'প্রোফাইল';
    else if (pathname.includes('/learn')) displayTitle = 'লার্নিং স্পেস';
    else displayTitle = 'IQC Academy';
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className={styles.title}>{displayTitle}</h1>
      </div>
      
      <div className={styles.right}>
        <button className={styles.iconButton}>
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
