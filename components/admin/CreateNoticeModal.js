'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus } from 'lucide-react';

export default function CreateNoticeModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', body: '', link: '', linkText: '', important: false, expiresAt: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          expiresAt: form.expiresAt || null,
          link: form.link || null,
          linkText: form.linkText || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'কোনো সমস্যা হয়েছে।');
      } else {
        setOpen(false);
        setForm({ title: '', body: '', link: '', linkText: '', important: false, expiresAt: '' });
        router.refresh();
      }
    } catch {
      alert('নেটওয়ার্ক সমস্যা।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
        <Plus size={16} /> নতুন নোটিশ
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', position: 'relative' }}>
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>নতুন নোটিশ তৈরি করুন</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">শিরোনাম *</label>
                <input name="title" value={form.title} onChange={handleChange} required className="form-input" placeholder="নোটিশের শিরোনাম" />
              </div>

              <div className="form-group">
                <label className="form-label">বিবরণ *</label>
                <textarea name="body" value={form.body} onChange={handleChange} required className="form-input" rows={3} placeholder="নোটিশের বিস্তারিত..." style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">লিংক (ঐচ্ছিক)</label>
                  <input name="link" value={form.link} onChange={handleChange} className="form-input" placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">লিংক টেক্সট</label>
                  <input name="linkText" value={form.linkText} onChange={handleChange} className="form-input" placeholder="বিস্তারিত দেখুন" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">মেয়াদ শেষের তারিখ (ঐচ্ছিক)</label>
                  <input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.75rem' }}>
                  <input name="important" type="checkbox" id="important" checked={form.important} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }} />
                  <label htmlFor="important" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>গুরুত্বপূর্ণ নোটিশ?</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'প্রকাশ হচ্ছে...' : 'প্রকাশ করুন'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setOpen(false)} disabled={loading}>
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
