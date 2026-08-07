'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Trophy, Medal, Save, Loader2 } from 'lucide-react';

export default function LeaderboardClient({ courseId, courseTitle }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('without');
  const [vivaInputs, setVivaInputs] = useState({});
  const [saving, setSaving] = useState({});

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}/leaderboard`)
      .then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [courseId]);

  const saveViva = async (userId) => {
    const marks = parseInt(vivaInputs[userId]);
    if (isNaN(marks)) return alert('বৈধ নম্বর দিন');
    setSaving(p => ({ ...p, [userId]: true }));
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/viva`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, marks })
      });
      if (res.ok) {
        // Refetch leaderboard
        const r = await fetch(`/api/admin/courses/${courseId}/leaderboard`);
        setData(await r.json());
        setVivaInputs(p => ({ ...p, [userId]: '' }));
      }
    } finally { setSaving(p => ({ ...p, [userId]: false })); }
  };

  const rankColor = (rank) => rank === 1 ? '#f59e0b' : rank === 2 ? '#9ca3af' : rank === 3 ? '#b45309' : 'var(--color-text-muted)';

  const renderTable = (entries, showViva) => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-earth-1)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>র‍্যাংক</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>শিক্ষার্থী</th>
            {data.subjects.map(s => <th key={s.id} style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>{s.title}</th>)}
            <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>মোট নম্বর</th>
            {showViva && <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>ভাইভা নম্বর</th>}
            {showViva && <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>মোট (ভাইভা সহ)</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.user.id} style={{ borderBottom: '1px solid var(--color-earth-1)', backgroundColor: entry.rank <= 3 ? `${rankColor(entry.rank)}08` : 'transparent' }}>
              <td style={{ padding: '1rem', fontWeight: 800, fontSize: '1.1rem', color: rankColor(entry.rank) }}>
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 600 }}>{entry.user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{entry.user.mobile}</div>
              </td>
              {data.subjects.map(s => (
                <td key={s.id} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                  {entry.subjectScores[s.id] ? (
                    <span style={{ color: entry.subjectScores[s.id].passed ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {entry.subjectScores[s.id].score}/{entry.subjectScores[s.id].total}
                    </span>
                  ) : <span style={{ color: 'var(--color-text-light)' }}>—</span>}
                </td>
              ))}
              <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '1.05rem' }}>{entry.totalExamScore}</td>
              {showViva && (
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                    <input type="number" min="0" placeholder={entry.vivaMarks || '০'} value={vivaInputs[entry.user.id] ?? ''} onChange={e => setVivaInputs(p => ({ ...p, [entry.user.id]: e.target.value }))}
                      style={{ width: '60px', textAlign: 'center', padding: '0.35rem', border: '1px solid var(--color-earth-1)', borderRadius: '6px', fontSize: '0.9rem' }} />
                    <button onClick={() => saveViva(entry.user.id)} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.6rem' }} disabled={saving[entry.user.id]}>
                      {saving[entry.user.id] ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                    </button>
                  </div>
                  {entry.vivaMarks > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>বর্তমান: {entry.vivaMarks}</div>}
                </td>
              )}
              {showViva && <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>{entry.grandTotal}</td>}
            </tr>
          ))}
          {entries.length === 0 && <tr><td colSpan={4 + data.subjects.length + (showViva ? 2 : 0)} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>কোনো তথ্য পাওয়া যায়নি।</td></tr>}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <Link href={`/admin/courses/${courseId}/subjects`} className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '0.75rem' }}>
          <ChevronLeft size={16} /> সাবজেক্টে ফিরে যান
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy size={24} color="#f59e0b" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>লিডারবোর্ড</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{courseTitle}</p>
      </header>

      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        <button className={`tab ${tab === 'without' ? 'active' : ''}`} onClick={() => setTab('without')}><Medal size={15} style={{ display: 'inline', marginRight: '5px' }} />ভাইভা ছাড়া</button>
        <button className={`tab ${tab === 'with' ? 'active' : ''}`} onClick={() => setTab('with')}><Trophy size={15} style={{ display: 'inline', marginRight: '5px' }} />ভাইভা সহ</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto 1rem' }} />লোড হচ্ছে...</div>
      ) : (
        <div className="card" style={{ padding: '1rem' }}>
          {tab === 'without' ? renderTable(data.withoutViva, false) : renderTable(data.withViva, true)}
        </div>
      )}
    </div>
  );
}
