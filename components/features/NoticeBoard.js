import { Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import styles from './NoticeBoard.module.css';

export default async function NoticeBoard() {
  const notices = await prisma.notice.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  return (
    <div className={styles.noticeBoard}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Bell size={20} className={styles.icon} />
          নোটিশ বোর্ড
        </h2>
        <Link href="/notices" className={styles.viewAll}>
          সকল নোটিশ <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className={styles.list}>
        {notices.length > 0 ? notices.map((notice) => (
          <div key={notice.id} className={`${styles.noticeItem} ${notice.isImportant ? styles.important : ''}`}>
            <div className={styles.noticeDate}>
              {new Date(notice.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h3 className={styles.noticeTitle}>{notice.title}</h3>
            <p className={styles.noticeBody}>{notice.content}</p>
          </div>
        )) : (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>কোনো নোটিশ নেই</p>
        )}
      </div>
    </div>
  );
}
