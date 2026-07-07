'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function CreateContentModal({ onContentCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    type: 'ARTICLE',
    body: '',
    videoUrl: '',
    pdfUrl: '',
    tags: '',
    readingTime: '',
    published: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      alert('শিরোনাম আবশ্যক');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setOpen(false);
        setForm({
          title: '', type: 'ARTICLE', body: '', videoUrl: '', pdfUrl: '', tags: '', readingTime: '', published: false
        });
        if (onContentCreated) onContentCreated();
      } else {
        const data = await res.json();
        alert(data.error || 'সমস্যা হয়েছে');
      }
    } catch (err) {
      alert('নেটওয়ার্ক সমস্যা');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Plus size={16} /> নতুন কন্টেন্ট
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem'
        }}>
          <div style={{
            background: 'var(--color-surface)', width: '100%', maxWidth: '600px',
            borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-earth-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>নতুন কন্টেন্ট তৈরি করুন</h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">শিরোনাম *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="কন্টেন্টের শিরোনাম" required />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">ধরন</label>
                    <select name="type" value={form.type} onChange={handleChange} className="form-input">
                      <option value="ARTICLE">আর্টিকেল</option>
                      <option value="VIDEO">ভিডিও</option>
                      <option value="PDF">পিডিএফ</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">পড়ার/দেখার সময়</label>
                    <input name="readingTime" value={form.readingTime} onChange={handleChange} className="form-input" placeholder="যেমন: ৫ মিনিট" />
                  </div>
                </div>

                {form.type === 'ARTICLE' && (
                  <div className="form-group">
                    <label className="form-label">বিস্তারিত বর্ণনা</label>
                    <textarea name="body" value={form.body} onChange={handleChange} className="form-input" placeholder="আর্টিকেলটি এখানে লিখুন..." rows="4" />
                  </div>
                )}

                {form.type === 'VIDEO' && (
                  <div className="form-group">
                    <label className="form-label">ভিডিও URL</label>
                    <input name="videoUrl" value={form.videoUrl} onChange={handleChange} className="form-input" placeholder="ইউটিউব বা ভিডিওর লিংক" />
                  </div>
                )}

                {form.type === 'PDF' && (
                  <div className="form-group">
                    <label className="form-label">PDF URL</label>
                    <input name="pdfUrl" value={form.pdfUrl} onChange={handleChange} className="form-input" placeholder="পিডিএফ ফাইলের লিংক" />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">ট্যাগসমূহ</label>
                  <input name="tags" value={form.tags} onChange={handleChange} className="form-input" placeholder="কমা দিয়ে লিখুন (যেমন: ইসলাম, ইতিহাস)" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="published-checkbox" name="published" checked={form.published} onChange={handleChange} style={{ width: '1.25rem', height: '1.25rem' }} />
                  <label htmlFor="published-checkbox" style={{ fontWeight: 500 }}>প্রকাশ করুন</label>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setOpen(false)} className="btn btn-outline" disabled={loading}>বাতিল</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
