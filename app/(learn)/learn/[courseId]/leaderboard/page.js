'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Trophy, Medal, Lock, User, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export default function CourseLeaderboardPage() {
  // Use courseId since it's located in app/(learn)/learn/[courseId]/leaderboard/page.js
  const { courseId } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('with'); // Default to with viva if data has it

  useEffect(() => {
    fetchWithAuth(`/api/courses/${courseId}/leaderboard`)
      .then(async r => {
        if (r.status === 401) {
          router.push('/login');
          return;
        }
        if (!r.ok) {
          const err = await r.json();
          throw new Error(err.error || 'লিডারবোর্ড লোড করতে সমস্যা হয়েছে।');
        }
        return r.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [courseId, router]);

  const rankColor = (r) => r === 1 ? '#f59e0b' : r === 2 ? '#9ca3af' : r === 3 ? '#b45309' : 'var(--color-text-muted)';
  const rankBg = (r, isMe) => isMe ? 'var(--color-primary-50)' : (r === 1 ? '#fefce8' : r === 2 ? '#f9fafb' : r === 3 ? '#fffbeb' : 'transparent');

  if (loading) {
    return (
      <main style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ padding: '4rem 0' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>লিডারবোর্ড লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <Link href={`/learn/${courseId}`} className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '1.5rem' }}>
          <ChevronLeft size={16} /> কোর্সে ফিরে যান
        </Link>
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <AlertCircle size={48} color="var(--color-error)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-error)' }}>ত্রুটি!</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
        </div>
      </main>
    );
  }

  if (data?.published === false) {
    return (
      <main style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <Link href={`/learn/${courseId}`} className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '1.5rem' }}>
          <ChevronLeft size={16} /> কোর্সে ফিরে যান
        </Link>
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Lock size={48} color="var(--color-text-light)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>লিডারবোর্ড এখনো প্রকাশিত হয়নি</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>ফলাফল সম্পূর্ণ প্রস্তুত হলে অ্যাডমিন লিডারবোর্ড প্রকাশ করবেন।</p>
        </div>
      </main>
    );
  }

  const entries = data?.withViva || [];
  
  // Format masked name function (e.g. Farad -> F***d)
  // Or display full name if it's the logged-in user
  const displayName = (user, isMe) => {
    if (isMe) return user.name;
    const parts = user.name.split(' ');
    return parts.map(p => {
      if (p.length <= 2) return p;
      return p[0] + '*'.repeat(p.length - 2) + p[p.length - 1];
    }).join(' ');
  };

  return (
    <main style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href={`/learn/${courseId}`} className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '1.5rem' }}>
        <ChevronLeft size={16} /> কোর্সে ফিরে যান
      </Link>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
          <Trophy color="#f59e0b" size={56} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-dark)' }}>লিডারবোর্ড</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>ফাইনাল পরীক্ষার ভিত্তিতে র‍্যাংকিং</p>
      </div>

      {data?.me && (
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-surface))', border: '1px solid var(--color-primary-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <User size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>আপনার বর্তমান র‍্যাংক</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                {data.me.rank <= 3 ? 'শীর্ষ ৩-এ আছেন! 🎉' : `#${data.me.rank} / ${data.totalParticipants}`}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '1rem' }}>
        {entries.length > 0 && data?.subjects?.length > 0 && (
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>মোট পরীক্ষার্থী: {data.totalParticipants} জন</div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-earth-1)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>র‍্যাংক</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>নাম</th>
                {data?.subjects?.map(s => <th key={s.id} style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>{s.title}</th>)}
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>মোট নম্বর</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => {
                const isMe = data?.me?.userId === entry.user.id;
                
                return (
                  <tr key={entry.user.id} style={{ borderBottom: '1px solid var(--color-earth-1)', background: rankBg(entry.rank, isMe) }}>
                    <td style={{ padding: '1rem', fontWeight: 800, fontSize: '1.1rem', color: rankColor(entry.rank) }}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: isMe ? 800 : 600, color: isMe ? 'var(--color-primary-dark)' : 'var(--color-text-dark)' }}>
                      {displayName(entry.user, isMe)} {isMe && <span style={{ fontSize: '0.7rem', background: 'var(--color-primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.5rem', verticalAlign: 'middle' }}>আপনি</span>}
                    </td>
                    {data?.subjects?.map(s => {
                      const subjScore = entry.subjectScores[s.id];
                      return (
                        <td key={s.id} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                          {subjScore ? (
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: subjScore.passed ? 'var(--color-success)' : 'var(--color-error)' }}>
                                {subjScore.score}/{subjScore.total}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>
                                {Math.round((subjScore.score / subjScore.total) * 100)}%
                              </div>
                            </div>
                          ) : <span style={{ color: 'var(--color-text-light)' }}>—</span>}
                        </td>
                      );
                    })}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{entry.grandTotal}</div>
                      {entry.vivaMarks > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>ভাইভা: {entry.vivaMarks}</div>}
                    </td>
                  </tr>
                );
              })}
              {(!entries || entries.length === 0) && (
                <tr><td colSpan={4 + (data?.subjects?.length || 0)} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>এখনো কেউ পরীক্ষা দেয়নি।</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
