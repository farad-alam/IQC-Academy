'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Trophy } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CourseLeaderboardPage() {
  const { id: courseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/leaderboard`)
      .then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [courseId]);

  const rankColor = (r) => r === 1 ? '#f59e0b' : r === 2 ? '#9ca3af' : r === 3 ? '#b45309' : 'var(--color-text-muted)';
  const rankBg = (r) => r === 1 ? '#fefce8' : r === 2 ? '#f9fafb' : r === 3 ? '#fffbeb' : 'transparent';

  return (
    <main style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href={`/courses/${courseId}`} className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '1.5rem' }}>
        <ChevronLeft size={16} /> কোর্সে ফিরে যান
      </Link>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>লিডারবোর্ড</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>ফাইনাল পরীক্ষার ভিত্তিতে র‍্যাংকিং</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-earth-1)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>র‍্যাংক</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>নাম</th>
                {data?.subjects?.map(s => <th key={s.id} style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>{s.title}</th>)}
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>মোট</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>গ্র্যান্ড টোটাল</th>
              </tr>
            </thead>
            <tbody>
              {data?.withViva?.map(entry => (
                <tr key={entry.user.id} style={{ borderBottom: '1px solid var(--color-earth-1)', background: rankBg(entry.rank) }}>
                  <td style={{ padding: '1rem', fontWeight: 800, fontSize: '1.1rem', color: rankColor(entry.rank) }}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{entry.user.name}</td>
                  {data?.subjects?.map(s => (
                    <td key={s.id} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                      {entry.subjectScores[s.id] ? (
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: entry.subjectScores[s.id].passed ? 'var(--color-success)' : 'var(--color-error)' }}>
                          {entry.subjectScores[s.id].score}/{entry.subjectScores[s.id].total}
                        </span>
                      ) : <span style={{ color: 'var(--color-text-light)' }}>—</span>}
                    </td>
                  ))}
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700 }}>{entry.totalExamScore}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.05rem' }}>{entry.grandTotal}</td>
                </tr>
              ))}
              {(!data?.withViva || data.withViva.length === 0) && (
                <tr><td colSpan={4 + (data?.subjects?.length || 0)} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>এখনো কেউ পরীক্ষা দেয়নি।</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
