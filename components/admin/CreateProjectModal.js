'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus } from 'lucide-react';

const CATEGORIES = ['মসজিদ', 'মাদ্রাসা', 'এতিমখানা', 'পানি সরবরাহ', 'ইফতার', 'অন্যান্য'];

export default function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '',
    targetAmount: '', icon: '🎯', deadline: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          deadline: form.deadline || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'কোনো সমস্যা হয়েছে।');
      } else {
        setOpen(false);
        setForm({ title: '', description: '', category: '', location: '', targetAmount: '', icon: '🎯', deadline: '' });
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
        <Plus size={16} /> নতুন প্রজেক্ট
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '560px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>নতুন প্রজেক্ট তৈরি করুন</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">প্রজেক্টের নাম *</label>
                <input name="title" value={form.title} onChange={handleChange} required className="form-input" placeholder="যেমন: ঢাকা মসজিদ নির্মাণ" />
              </div>

              <div className="form-group">
                <label className="form-label">বিবরণ *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required className="form-input" rows={3} placeholder="প্রজেক্টের বিস্তারিত..." style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">ক্যাটাগরি *</label>
                  <select name="category" value={form.category} onChange={handleChange} required className="form-input">
                    <option value="">বেছে নিন</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">অবস্থান *</label>
                  <input name="location" value={form.location} onChange={handleChange} required className="form-input" placeholder="যেমন: ঢাকা, বাংলাদেশ" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">লক্ষ্যমাত্রা (৳) *</label>
                  <input name="targetAmount" type="number" min="1" value={form.targetAmount} onChange={handleChange} required className="form-input" placeholder="100000" />
                </div>
                <div className="form-group">
                  <label className="form-label">আইকন (ইমোজি)</label>
                  <input name="icon" value={form.icon} onChange={handleChange} className="form-input" placeholder="🎯" maxLength={4} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">শেষ তারিখ (ঐচ্ছিক)</label>
                <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'তৈরি হচ্ছে...' : 'প্রজেক্ট তৈরি করুন'}
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
