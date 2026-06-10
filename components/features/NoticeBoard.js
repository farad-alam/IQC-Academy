import { Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { mockNotices } from '@/lib/mockData';
import styles from './NoticeBoard.module.css';

export default function NoticeBoard() {
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
        {mockNotices.slice(0, 3).map((notice) => (
          <div key={notice.id} className={`${styles.noticeItem} ${notice.important ? styles.important : ''}`}>
            <div className={styles.noticeDate}>{notice.date}</div>
            <h3 className={styles.noticeTitle}>{notice.title}</h3>
            <p className={styles.noticeBody}>{notice.body}</p>
            {notice.link && (
              <Link href={notice.link} className={styles.noticeLink}>
                {notice.linkText} <ArrowRight size={14} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
