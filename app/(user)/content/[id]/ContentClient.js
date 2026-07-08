'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, PlayCircle, FileText, File } from 'lucide-react';

export default function ContentClient({ module, isCompleted, hasQuiz, nextModuleId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [completedState, setCompletedState] = useState(isCompleted);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${module.courseId}/modules/${module.id}/complete`, {
        method: 'POST'
      });
      const data = await res.json();
      
      if (data.success) {
        setCompletedState(true);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    if (module.contentType === 'VIDEO') return <PlayCircle size={18} />;
    if (module.contentType === 'PDF') return <File size={18} />;
    return <FileText size={18} />;
  };

  const getTypeName = () => {
    if (module.contentType === 'VIDEO') return 'ভিডিও';
    if (module.contentType === 'PDF') return 'পিডিএফ';
    return 'আর্টিকেল';
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      {/* Breadcrumb / Back button */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
        <Link href={`/courses/${module.courseId}`} className="btn btn-ghost" style={{ padding: 0 }}>
          <ChevronLeft size={16} /> কোর্সে ফিরে যান
        </Link>
        <span style={{ color: 'var(--color-text-muted)' }}>•</span>
        <span style={{ color: 'var(--color-text-muted)' }}>{module.course.title}</span>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {getIcon()} {getTypeName()}
          </span>
          {module.duration && (
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
              সময়: {module.duration}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem', lineHeight: 1.4 }}>
          {module.title}
        </h1>

        <div className="divider" />

        <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
          {module.contentType === 'VIDEO' ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
              <iframe 
                src={module.videoUrl} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                allowFullScreen
                title={module.title}
              />
            </div>
          ) : module.contentType === 'PDF' ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px' }}>
              <p style={{ marginBottom: '1rem' }}>এই পিডিএফটি পড়তে ভিউয়ারে ওপেন করুন।</p>
              <a href={module.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-outline">পিডিএফ খুলুন</a>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: module.body?.replace(/\n/g, '<br/>') || '' }} />
          )}
        </div>

        <div className="divider" style={{ marginTop: '3rem' }} />

        <div style={{ backgroundColor: 'var(--color-bg)', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>আপনি কি পড়া শেষ করেছেন?</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '1.5rem' }}>
            {completedState ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, padding: '0.75rem', backgroundColor: 'var(--color-success-bg)', borderRadius: '8px', width: '100%', maxWidth: '300px' }}>
                <CheckCircle2 size={24} /> সম্পন্ন করা হয়েছে
              </div>
            ) : (
              <button 
                onClick={handleComplete} 
                className="btn btn-primary" 
                disabled={loading}
                style={{ width: '100%', maxWidth: '300px' }}
              >
                {loading ? 'প্রসেস হচ্ছে...' : 'সম্পন্ন করেছি'}
              </button>
            )}

            {/* If completed, show Next / Quiz buttons */}
            {completedState && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                {hasQuiz && (
                  <Link href={`/quiz/${module.id}`} className="btn btn-accent">
                    কুইজে অংশ নিন
                  </Link>
                )}
                {nextModuleId && (
                  <Link href={`/content/${nextModuleId}`} className="btn btn-outline">
                    পরবর্তী মডিউল
                  </Link>
                )}
                {!hasQuiz && !nextModuleId && (
                  <Link href={`/courses/${module.courseId}`} className="btn btn-outline">
                    কোর্সে ফিরে যান
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
