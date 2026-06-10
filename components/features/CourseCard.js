import Link from 'next/link';
import { Lock, BookOpen, Clock, User, Award } from 'lucide-react';
import styles from './CourseCard.module.css';

export default function CourseCard({ course }) {
  const isLocked = course.status === 'locked';
  const isEnrolled = course.status === 'enrolled';
  const isCompleted = course.status === 'completed';

  return (
    <div className={`card ${styles.courseCard}`}>
      <div className={styles.coverArea}>
        {course.cover ? (
          <img src={course.cover} alt={course.title} className="card-image" />
        ) : (
          <div className={styles.placeholderCover}>
            <BookOpen size={48} className={styles.placeholderIcon} />
            {isLocked && (
              <div className={styles.lockedOverlay}>
                <Lock size={32} />
              </div>
            )}
          </div>
        )}
        
        {/* Badges overlay */}
        <div className={styles.badges}>
          {course.type === 'paid' ? (
            <span className="badge badge-warning">পেইড</span>
          ) : (
            <span className="badge badge-success">ফ্রি</span>
          )}
          
          <span className="badge badge-earth">{course.level}</span>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.desc}>{course.description}</p>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <User size={14} /> <span>{course.instructor}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={14} /> <span>{course.duration}</span>
          </div>
        </div>

        {isEnrolled && (
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressText}>
                অগ্রগতি: {course.completedModules}/{course.totalModules} মডিউল
              </span>
              <span className={styles.progressPercent}>{course.progress}%</span>
            </div>
            <div className="progress-bar-track" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        )}

        <div className={styles.footer}>
          {isCompleted ? (
            <div className={styles.completedBadge}>
              <Award size={18} /> কোর্স সম্পন্ন
            </div>
          ) : isLocked ? (
            <div className={styles.priceRow}>
              <span className={styles.price}>৳{course.price}</span>
              <Link href={`/courses/${course.id}/enroll`} className="btn btn-accent btn-sm">
                ভর্তি হোন <Lock size={14} />
              </Link>
            </div>
          ) : (
            <Link href={`/courses/${course.id}`} className="btn btn-primary btn-sm w-full">
              {isEnrolled ? 'চালিয়ে যান' : 'কোর্স শুরু করুন'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
