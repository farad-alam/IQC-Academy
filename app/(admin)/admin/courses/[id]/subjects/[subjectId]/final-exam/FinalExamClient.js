'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Trash2, Edit, Loader2, ClipboardList } from 'lucide-react';
import ProtectedDeleteModal from '@/components/admin/ProtectedDeleteModal';
import { toast } from 'react-hot-toast';

export default function SubjectFinalExamClient({ courseId, subjectId, subjectTitle }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ question: '', options: ['', '', '', ''], correct: 0, explanation: '' });
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/subjects/${subjectId}/final-exam`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [subjectId]);

  const resetForm = () => setForm({ question: '', options: ['', '', '', ''], correct: 0, explanation: '' });
  const openAdd = () => { resetForm(); setEditingId(null); setShowForm(true); };
  const openEdit = (q) => { setEditingId(q.id); setForm({ question: q.question, options: [...q.options], correct: q.correct, explanation: q.explanation || '' }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const setOption = (i, val) => setForm(p => { const opts = [...p.options]; opts[i] = val; return { ...p, options: opts }; });
  const addOption = () => setForm(p => ({ ...p, options: [...p.options, ''] }));
  const removeOption = (i) => setForm(p => { const opts = p.options.filter((_, idx) => idx !== i); return { ...p, options: opts, correct: Math.min(p.correct, opts.length - 1) }; });

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.options.some(o => !o.trim())) return alert('সব অপশন পূরণ করুন');
    setSaving(true);
    try {
      const isEdit = !!editingId;
      const url = isEdit ? `/api/admin/subjects/${subjectId}/final-exam/${editingId}` : `/api/admin/subjects/${subjectId}/final-exam`;
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { closeForm(); fetchData(); }
      else { const d = await res.json(); alert(d.error || 'ত্রুটি'); }
    } finally { setSaving(false); }
  };

  const confirmDelete = async (securityKey) => {
    try {
      const res = await fetch(`/api/admin/subjects/${subjectId}/final-exam/${deletingId}`, { 
        method: 'DELETE',
        headers: { 'x-deletion-key': securityKey }
      });
      const resData = await res.json();
      if (res.ok) {
        toast.success('প্রশ্নটি মুছে ফেলা হয়েছে');
        setDeletingId(null);
        fetchData();
      } else {
        toast.error(resData.error || 'মুছে ফেলতে সমস্যা হয়েছে');
      }
    } catch {
      toast.error('নেটওয়ার্ক সমস্যা');
    }
  };

  // Update final exam config
  const updateConfig = async (field, value) => {
    await fetch(`/api/admin/courses/${courseId}/subjects/${subjectId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: value })
    });
    fetchData();
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link href={`/admin/courses/${courseId}/subjects`} className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '0.5rem' }}>
            <ChevronLeft size={16} /> সাবজেক্টে ফিরে যান
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ClipboardList size={22} color="var(--color-primary)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>ফাইনাল পরীক্ষার প্রশ্ন</h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{subjectTitle}</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><Plus size={18} /> প্রশ্ন যোগ করুন</button>
      </header>

      {/* Config card */}
      {data?.subject && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>পরীক্ষার কনফিগারেশন:</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>ফাইনাল পরীক্ষার মোট নম্বর</label>
              <input type="number" className="form-input" min="1" defaultValue={data.subject.finalExamDisplayCount}
                onBlur={e => updateConfig('finalExamDisplayCount', parseInt(e.target.value) || 20)}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>পাস মার্ক (নম্বর)</label>
              <input type="number" className="form-input" min="1" max={data.subject.finalExamDisplayCount} defaultValue={data.subject.finalExamPassMark}
                onBlur={e => {
                  const val = parseInt(e.target.value) || 40;
                  if (val > data.subject.finalExamDisplayCount) {
                     alert(`পাস মার্ক মোট নম্বর (${data.subject.finalExamDisplayCount}) এর বেশি হতে পারে না!`);
                     e.target.value = data.subject.finalExamDisplayCount;
                     updateConfig('finalExamPassMark', data.subject.finalExamDisplayCount);
                  } else {
                     updateConfig('finalExamPassMark', val);
                  }
                }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>প্রদর্শিত প্রশ্নের সংখ্যা</label>
              <input type="number" className="form-input" value={data.subject.finalExamDisplayCount} disabled style={{ backgroundColor: 'var(--color-surface-alt)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }} />
            </div>
          </div>
          
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>মোট প্রশ্ন ব্যাংক: <strong>{data.quizzes.length} টি</strong></div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--color-primary-light)' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>{editingId ? 'প্রশ্ন সম্পাদনা' : 'নতুন প্রশ্ন যোগ'}</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">প্রশ্ন *</label>
              <textarea className="form-input" rows="3" required value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="প্রশ্নটি লিখুন..." />
            </div>
            <div>
              <label className="form-label">অপশনসমূহ (সঠিক উত্তরটি নির্বাচন করুন) *</label>
              {form.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <input type="radio" name="correct" checked={form.correct === i} onChange={() => setForm(p => ({ ...p, correct: i }))} style={{ accentColor: 'var(--color-success)', width: '18px', height: '18px', flexShrink: 0 }} />
                  <input className="form-input" style={{ marginBottom: 0, flex: 1, border: form.correct === i ? '1.5px solid var(--color-success)' : '' }} value={opt} onChange={e => setOption(i, e.target.value)} placeholder={`অপশন ${i + 1}`} required />
                  {form.options.length > 2 && <button type="button" onClick={() => removeOption(i)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)', flexShrink: 0 }}><Trash2 size={14} /></button>}
                </div>
              ))}
              <button type="button" onClick={addOption} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)', marginTop: '0.25rem' }}><Plus size={14} /> অপশন যোগ</button>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">ব্যাখ্যা (ঐচ্ছিক)</label>
              <textarea className="form-input" rows="2" value={form.explanation} onChange={e => setForm(p => ({ ...p, explanation: e.target.value }))} placeholder="সঠিক উত্তরের ব্যাখ্যা লিখুন..." />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><Loader2 size={15} className="spin" /> সংরক্ষণ...</> : 'সংরক্ষণ করুন'}
              </button>
              <button type="button" className="btn btn-outline" onClick={closeForm}>বাতিল</button>
            </div>
          </form>
        </div>
      )}

      {/* Quiz list */}
      {loading ? <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        : data?.quizzes.length === 0 ? <div className="empty-state"><ClipboardList size={36} /><p>কোনো প্রশ্ন নেই।</p></div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.quizzes.map((q, idx) => (
            <div key={q.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)', minWidth: '24px', fontFamily: 'var(--font-latin)' }}>{idx + 1}.</span>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{q.question}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {q.options.map((opt, i) => (
                          <div key={i} style={{ fontSize: '0.875rem', color: i === q.correct ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: i === q.correct ? 600 : 400 }}>
                            {i === q.correct ? '✅' : '○'} {opt}
                          </div>
                        ))}
                      </div>
                      {q.explanation && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>ব্যাখ্যা: {q.explanation}</p>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button onClick={() => openEdit(q)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}><Edit size={15} /></button>
                  <button onClick={() => setDeletingId(q.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }

      <ProtectedDeleteModal 
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="প্রশ্ন মুছে ফেলুন"
        message="আপনি কি নিশ্চিত যে এই প্রশ্নটি মুছে ফেলতে চান?"
      />
    </div>
  );
}
