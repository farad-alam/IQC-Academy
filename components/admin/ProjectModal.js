'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Edit } from 'lucide-react';

const CATEGORIES = ['মসজিদ', 'মাদ্রাসা', 'এতিমখানা', 'পানি সরবরাহ', 'ইফতার', 'অন্যান্য'];

export default function ProjectModal({ project, onSuccess }) {
  const isEdit = !!project;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '',
    targetAmount: '', icon: '🎯', deadline: '', status: 'ACTIVE'
  });

  useEffect(() => {
    if (isEdit && project) {
      setForm({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        location: project.location || '',
        targetAmount: project.targetAmount ? project.targetAmount.toString() : '',
        icon: project.icon || '🎯',
        deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
        status: project.status || 'ACTIVE'
      });
    }
  }, [project, isEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const url = isEdit ? `/api/admin/projects/${project.id}` : '/api/admin/projects';
    const method = isEdit ? 'PATCH' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          targetAmount: form.targetAmount ? parseFloat(form.targetAmount) : undefined,
          deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'কোনো সমস্যা হয়েছে।');
      } else {
        setOpen(false);
        if (!isEdit) {
          setForm({ title: '', description: '', category: '', location: '', targetAmount: '', icon: '🎯', deadline: '', status: 'ACTIVE' });
        }
        if (onSuccess) onSuccess();
      }
    } catch {
      alert('নেটওয়ার্ক সমস্যা।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isEdit ? (
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)} title="এডিট করুন" style={{ padding: '0.5rem' }}>
          <Edit size={16} />
        </button>
      ) : (
        <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> নতুন প্রজেক্ট
        </button>
      )}

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '560px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {isEdit ? 'প্রজেক্ট সম্পাদনা' : 'নতুন প্রজেক্ট তৈরি করুন'}
            </h2>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">শেষ তারিখ (ঐচ্ছিক)</label>
                  <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="form-input" />
                </div>
                {isEdit && (
                  <div className="form-group">
                    <label className="form-label">স্ট্যাটাস</label>
                    <select name="status" value={form.status} onChange={handleChange} className="form-input">
                      <option value="ACTIVE">চলমান (Active)</option>
                      <option value="COMPLETED">সম্পন্ন (Completed)</option>
                      <option value="PAUSED">স্থগিত (Paused)</option>
                    </select>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setOpen(false)} disabled={loading}>
                  বাতিল
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'সংরক্ষণ হচ্ছে...' : (isEdit ? 'আপডেট করুন' : 'তৈরি করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
