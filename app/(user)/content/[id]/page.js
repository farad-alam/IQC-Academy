'use client';
import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { mockContents } from '@/lib/mockData';

export default function ContentDetailPage({ params }) {
  // Unwrap params using React.use() as required in Next.js 14+ for client components
  const { id } = use(params);
  const content = mockContents.find(c => c.id === parseInt(id)) || mockContents[0];

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <Link href="/content" className="btn btn-ghost" style={{ padding: 0, marginBottom: '2rem' }}>
        <ChevronLeft size={20} /> ফিরে যান
      </Link>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span className="badge badge-primary">{content.type === 'text' ? 'আর্টিকেল' : content.type === 'pdf' ? 'পিডিএফ' : 'ভিডিও'}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
            পড়তে সময় লাগবে: {content.readingTime}
          </span>
        </div>

        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.4 }}>
          {content.title}
        </h1>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {content.tags.map((tag, idx) => (
            <span key={idx} style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', backgroundColor: 'var(--color-primary-50)', padding: '2px 8px', borderRadius: '12px' }}>
              #{tag}
            </span>
          ))}
        </div>

        <div className="divider" />

        <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
          {content.type === 'video' ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
              <iframe 
                src={content.videoUrl} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                allowFullScreen
                title={content.title}
              />
            </div>
          ) : content.type === 'pdf' ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px' }}>
              <p style={{ marginBottom: '1rem' }}>এই পিডিএফটি পড়তে ভিউয়ারে ওপেন করুন।</p>
              <button className="btn btn-outline">পিডিএফ ভিউয়ার খুলুন</button>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content.body?.replace(/\\n/g, '<br/>') || '' }} />
          )}
        </div>

        <div className="divider" style={{ marginTop: '3rem' }} />

        <div style={{ backgroundColor: 'var(--color-bg)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>আপনি কি পড়া শেষ করেছেন?</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            নিজে যাচাই করতে কুইজে অংশ নিন।
          </p>
          
          {content.isCompleted ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600 }}>
              <CheckCircle2 size={24} /> কুইজ সম্পন্ন করেছেন
            </div>
          ) : (
            <Link href={`/quiz/${content.id}`} className="btn btn-primary">
              কুইজ শুরু করুন
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
