import prisma from '@/lib/db';
import Link from 'next/link';
import styles from './projects.module.css';

export const revalidate = 3600; // ISR: regenerate at most every 1 hour

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>চলুন একসাথে পরিবর্তন আনি</h1>
        <p className={styles.heroSubtitle}>
          IQC Academy-এর বিভিন্ন দ্বীনি ও সামাজিক প্রজেক্টে অংশগ্রহণ করুন এবং আখিরাতের জন্য সঞ্চয় করুন।
        </p>
      </section>

      <div className={styles.projectsGrid}>
        {projects.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-muted)', padding: '4rem 0' }}>বর্তমানে কোনো সক্রিয় প্রজেক্ট নেই।</p>
        ) : projects.map(project => {
          const raised = Number(project.raisedAmount) || 0;
          const target = Number(project.targetAmount) || 1; // Prevent division by zero
          const progress = Math.min(100, Math.round((raised / target) * 100));

          return (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.cardImageWrapper}>
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className={styles.cardImage} />
                ) : (
                  <div className={styles.cardIconFallback}>{project.icon || '🎯'}</div>
                )}
              </div>
              
              <div className={styles.cardContent}>
                <h2 className={styles.projectTitle}>{project.title}</h2>
                <p className={styles.projectDesc}>{project.description}</p>
                
                <div className={styles.progressSection}>
                  <div className={styles.progressStats}>
                    <span style={{ color: 'var(--color-text-muted)' }}>লক্ষ্য: ৳{target.toLocaleString('bn-BD')}</span>
                    <span style={{ color: 'var(--color-primary-dark)' }}>সংগ্রহ: ৳{raised.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  </div>
                </div>
                
                <Link href={`/projects/${project.id}`} className={styles.donateBtn}>
                  দান করুন
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
