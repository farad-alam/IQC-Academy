'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, ChevronRight, BookOpen, CheckCircle, Clock, Archive, Loader2 } from 'lucide-react';

const STATUS_LABELS = {
  UPCOMING: { label: 'আসন্ন', color: 'var(--color-text-muted)', bg: 'var(--color-surface-alt)' },
  ENROLLING: { label: 'ভর্তি চলছে', color: '#16a34a', bg: '#dcfce7' },
  ACTIVE: { label: 'সক্রিয়', color: 'var(--color-primary-dark)', bg: 'var(--color-primary-50)' },
  COMPLETED: { label: 'সম্পন্ন', color: '#9333ea', bg: '#f3e8ff' },
  ARCHIVED: { label: 'আর্কাইভ', color: 'var(--color-text-light)', bg: 'var(--color-surface-alt)' },
};

export default function BatchesClient() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/batches');
      if (res.ok) setBatches(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBatches(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setForm({ name: '', description: '' });
        fetchBatches();
      } else {
        alert(data.error || 'Error creating batch');
      }
    } catch (e) { console.error(e); }
    finally { setCreating(false); }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>ব্যাচ ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>ব্যাচ তৈরি করুন, কোর্স ও শিক্ষার্থী যুক্ত করুন</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn btn-primary">
          <Plus size={18} /> নতুন ব্যাচ
        </button>
      </header>

      {showForm && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--color-primary-light)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>নতুন ব্যাচ তৈরি করুন</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="grid-2 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">ব্যাচের নাম *</label>
                <input className="form-input" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="যেমন: Batch A, Batch 2025-01" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">বিবরণ (ঐচ্ছিক)</label>
                <input className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="ব্যাচের সংক্ষিপ্ত বিবরণ" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={creating}>
                {creating ? <><Loader2 size={16} className="spin" /> সংরক্ষণ হচ্ছে...</> : 'তৈরি করুন'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>বাতিল</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />লোড হচ্ছে...
        </div>
      ) : batches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Users size={40} /></div>
          <h3>কোনো ব্যাচ নেই</h3>
          <p>প্রথম ব্যাচ তৈরি করতে উপরের বোতামে ক্লিক করুন।</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {batches.map(batch => {
            const st = STATUS_LABELS[batch.status] || STATUS_LABELS.UPCOMING;
            return (
              <Link key={batch.id} href={`/admin/batches/${batch.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                      <Users size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)' }}>{batch.name}</div>
                      {batch.description && <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{batch.description}</div>}
                      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <span><Users size={12} style={{ display: 'inline', marginRight: '3px' }} />{batch._count?.students || 0} শিক্ষার্থী</span>
                        <span><BookOpen size={12} style={{ display: 'inline', marginRight: '3px' }} />{batch._count?.courses || 0} কোর্স</span>
                        <span style={{ color: batch.coursesLocked ? 'var(--color-warning)' : 'var(--color-success)' }}>
                          {batch.coursesLocked ? '🔒 লক' : '🔓 আনলক'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, color: st.color, backgroundColor: st.bg }}>
                      {st.label}
                    </span>
                    <ChevronRight size={18} color="var(--color-text-light)" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
