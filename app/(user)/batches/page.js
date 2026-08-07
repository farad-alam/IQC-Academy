'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, BookOpen, ChevronRight, AlertCircle } from 'lucide-react';

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/batches').then(r => r.json()).then(data => { setBatches(data); setLoading(false); });
  }, []);

  if (loading) return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </main>
  );

  return (
    <main style={{ padding: '3rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>ব্যাচ ভর্তি</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          নিচের যেকোনো ব্যাচে নিবন্ধন করুন এবং আপনার শেখার যাত্রা শুরু করুন।
        </p>
      </div>

      {batches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--color-surface)', borderRadius: '16px', border: '1px dashed var(--color-earth-1)' }}>
          <AlertCircle size={48} style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>বর্তমানে কোনো ব্যাচে ভর্তি চলছে না</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>অনুগ্রহ করে পরে আবার দেখুন।</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {batches.map(batch => (
            <div key={batch.id} className="card" style={{ padding: '2rem', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ background: 'var(--color-primary-50)', padding: '0.5rem', borderRadius: '10px' }}>
                      <Users size={22} color="var(--color-primary)" />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{batch.name}</h2>
                      <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: '#dcfce7', color: '#16a34a' }}>ভর্তি চলছে</span>
                    </div>
                  </div>
                  {batch.description && <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{batch.description}</p>}
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <span><Users size={14} style={{ display: 'inline', marginRight: '4px' }} />{batch._count?.students || 0} জন নিবন্ধিত</span>
                    <span><BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} />{batch.courses?.length || 0} টি কোর্স</span>
                  </div>
                  {batch.courses?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {batch.courses.map(bc => (
                        <span key={bc.courseId} style={{ padding: '0.3rem 0.75rem', background: 'var(--color-surface-alt)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--color-text)' }}>
                          {bc.course.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Link href={`/batches/${batch.id}/register`} className="btn btn-primary" style={{ flexShrink: 0, padding: '0.75rem 1.75rem', fontSize: '1rem', fontWeight: 700 }}>
                  ভর্তি হন <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
