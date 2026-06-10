import Link from 'next/link';
import { BookText, FileText, PlayCircle } from 'lucide-react';
import styles from './ContentCard.module.css';

export default function ContentCard({ content }) {
  const getIcon = () => {
    switch (content.type) {
      case 'text': return <BookText size={18} />;
      case 'pdf': return <FileText size={18} />;
      case 'video': return <PlayCircle size={18} />;
      default: return <BookText size={18} />;
    }
  };

  const getBadgeClass = () => {
    switch (content.type) {
      case 'text': return 'badge-primary';
      case 'pdf': return 'badge-accent';
      case 'video': return 'badge-info';
      default: return 'badge-primary';
    }
  };

  const getTypeLabel = () => {
    switch (content.type) {
      case 'text': return 'আর্টিকেল';
      case 'pdf': return 'পিডিএফ';
      case 'video': return 'ভিডিও';
      default: return 'পাঠ্য';
    }
  };

  return (
    <div className={`card ${styles.contentCard}`}>
      <div className={styles.body}>
        <div className={styles.header}>
          <span className={`badge ${getBadgeClass()}`}>
            {getIcon()} {getTypeLabel()}
          </span>
          <span className={styles.time}>{content.readingTime}</span>
        </div>
        
        <h3 className={styles.title}>{content.title}</h3>
        <p className={styles.desc}>{content.description}</p>
        
        <div className={styles.footer}>
          <div className={styles.tags}>
            {content.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className={styles.tag}>#{tag}</span>
            ))}
          </div>
          
          <Link href={`/content/${content.id}`} className="btn btn-outline btn-sm">
            বিস্তারিত
          </Link>
        </div>
      </div>
    </div>
  );
}
