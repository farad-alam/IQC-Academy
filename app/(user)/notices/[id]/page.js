import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Bell } from 'lucide-react';

export const revalidate = 3600; // ISR: 1-hour fallback; admin edits instantly bust cache via revalidatePath

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const notice = await prisma.notice.findUnique({ where: { id: resolvedParams.id } });
  if (!notice) return { title: 'নোটিশ পাওয়া যায়নি' };
  return { title: `${notice.title} | IQC Academy` };
}

export default async function NoticeDetailPage({ params }) {
  const resolvedParams = await params;
  const notice = await prisma.notice.findUnique({ where: { id: resolvedParams.id } });

  if (!notice) notFound();

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px', minHeight: '60vh' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '2rem', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> মূল পেজে ফিরে যান
      </Link>

      <div className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        {notice.important && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--color-error)' }} />
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', 
            backgroundColor: notice.important ? 'var(--color-error-light)' : 'var(--color-primary-light)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: notice.important ? 'var(--color-error)' : 'var(--color-primary)'
          }}>
            <Bell size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{notice.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              <Calendar size={14} /> 
              {new Date(notice.publishedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        <div style={{ 
          fontSize: '1.05rem', 
          lineHeight: 1.6, 
          color: 'var(--color-text)', 
          whiteSpace: 'pre-wrap',
          borderTop: '1px solid var(--color-earth-1)',
          paddingTop: '1.5rem'
        }}>
          {notice.body}
        </div>

        {notice.link && (
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-earth-1)' }}>
            <a href={notice.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              {notice.linkText || 'বিস্তারিত দেখুন'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
