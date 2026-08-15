'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Edit, Trash2, BookOpen, ClipboardList, ChevronRight, Loader2, Trophy } from 'lucide-react';
import ProtectedDeleteModal from '@/components/admin/ProtectedDeleteModal';
import { toast } from 'react-hot-toast';

export default function SubjectsClient({ courseId, courseTitle }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', finalExamEnabled: false, finalExamPassMark: 40, finalExamDisplayCount: 20 });
  const [saving, setSaving] = useState(false);
  const [deletingSubjectId, setDeletingSubjectId] = useState(null);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/courses/${courseId}/subjects`);
    if (res.ok) setSubjects(await res.json());
    setLoading(false);
  }, [courseId]);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  const openAdd = () => { setEditingSubject(null); setForm({ title: '', description: '', finalExamEnabled: false, finalExamPassMark: 40, finalExamDisplayCount: 20 }); setShowForm(true); };
  const openEdit = (s) => { setEditingSubject(s); setForm({ title: s.title, description: s.description || '', finalExamEnabled: s.finalExamEnabled, finalExamPassMark: s.finalExamPassMark, finalExamDisplayCount: s.finalExamDisplayCount }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingSubject(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.finalExamEnabled && form.finalExamPassMark > form.finalExamDisplayCount) {
      alert(`ফাইনাল পরীক্ষার পাস মার্ক মোট নম্বর (${form.finalExamDisplayCount}) এর বেশি হতে পারে না!`);
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editingSubject;
      const url = isEdit ? `/api/admin/courses/${courseId}/subjects/${editingSubject.id}` : `/api/admin/courses/${courseId}/subjects`;
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { closeForm(); fetchSubjects(); }
      else { const d = await res.json(); alert(d.error || 'ত্রুটি'); }
    } finally { setSaving(false); }
  };

  const confirmDelete = async (securityKey) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/subjects/${deletingSubjectId}`, {
        method: 'DELETE',
        headers: { 'x-deletion-key': securityKey }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('সাবজেক্টটি সফলভাবে মুছে ফেলা হয়েছে');
        setDeletingSubjectId(null);
        fetchSubjects();
      } else {
        toast.error(data.error || 'মুছে ফেলতে সমস্যা হয়েছে');
      }
    } catch {
      toast.error('নেটওয়ার্ক সমস্যা');
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <Link href="/admin/courses" className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '0.5rem' }}>
            <ChevronLeft size={16} /> কোর্সে ফিরে যান
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>সাবজেক্ট ব্যবস্থাপনা</h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{courseTitle}</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><Plus size={18} /> নতুন সাবজেক্ট</button>
      </header>

      {showForm && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--color-primary-light)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
            {editingSubject ? 'সাবজেক্ট আপডেট' : 'নতুন সাবজেক্ট'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="grid-2 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">সাবজেক্টের নাম *</label>
                <input className="form-input" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="যেমন: বাংলা ব্যাকরণ" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">বিবরণ</label>
                <input className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="সংক্ষিপ্ত বিবরণ" />
              </div>
            </div>

            {/* Final Exam Config */}
            <div style={{ padding: '1rem', background: 'var(--color-surface-alt)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: form.finalExamEnabled ? '1rem' : 0 }}>
                <input type="checkbox" id="finalExamEnabled" checked={form.finalExamEnabled} onChange={e => setForm(p => ({ ...p, finalExamEnabled: e.target.checked }))} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }} />
                <label htmlFor="finalExamEnabled" style={{ fontWeight: 600, cursor: 'pointer' }}>ফাইনাল পরীক্ষা সক্রিয় করুন</label>
              </div>
              {form.finalExamEnabled && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">ফাইনাল পরীক্ষার মোট নম্বর</label>
                    <input type="number" className="form-input" min="1" value={form.finalExamDisplayCount} onChange={e => setForm(p => ({ ...p, finalExamDisplayCount: parseInt(e.target.value) || 20 }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">পাস মার্ক (নম্বর)</label>
                    <input type="number" className="form-input" min="1" max={form.finalExamDisplayCount} value={form.finalExamPassMark} onChange={e => setForm(p => ({ ...p, finalExamPassMark: parseInt(e.target.value) || 40 }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">প্রদর্শিত প্রশ্নের সংখ্যা</label>
                    <input type="number" className="form-input" value={form.finalExamDisplayCount} disabled style={{ backgroundColor: 'var(--color-surface-alt)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }} />
                  </div>
                </div>
              )}
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />লোড হচ্ছে...
        </div>
      ) : subjects.length === 0 ? (
        <div className="empty-state"><BookOpen size={36} /><h3>কোনো সাবজেক্ট নেই</h3><p>উপরে "নতুন সাবজেক্ট" বোতামে ক্লিক করুন।</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {subjects.map((subject, idx) => (
            <div key={subject.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-latin)', flexShrink: 0 }}>{idx + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{subject.title}</div>
                    {subject.description && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{subject.description}</div>}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}><BookOpen size={12} style={{ display: 'inline', marginRight: '3px' }} />{subject._count?.modules || 0} মডিউল</span>
                      {subject.finalExamEnabled && (
                        <span style={{ color: 'var(--color-accent-dark)' }}><ClipboardList size={12} style={{ display: 'inline', marginRight: '3px' }} />ফাইনাল পরীক্ষা ({subject._count?.finalExamQuizzes || 0} প্রশ্ন)</span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {subject.finalExamEnabled && (
                    <Link href={`/admin/courses/${courseId}/subjects/${subject.id}/final-exam`} className="btn btn-outline btn-sm" style={{ color: 'var(--color-accent-dark)' }}>
                      <ClipboardList size={14} /> পরীক্ষার প্রশ্ন
                    </Link>
                  )}
                  <Link href={`/admin/courses/${courseId}/subjects/${subject.id}/modules`} className="btn btn-outline btn-sm">
                    <BookOpen size={14} /> মডিউল <ChevronRight size={14} />
                  </Link>
                  <button onClick={() => openEdit(subject)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}><Edit size={15} /></button>
                  <button onClick={() => setDeletingSubjectId(subject.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProtectedDeleteModal 
        isOpen={!!deletingSubjectId}
        onClose={() => setDeletingSubjectId(null)}
        onConfirm={confirmDelete}
        title="সাবজেক্ট মুছে ফেলুন"
        message="আপনি কি নিশ্চিত যে এই সাবজেক্টটি মুছে ফেলতে চান? এর অন্তর্ভুক্ত সকল মডিউল ও কুইজ মুছে যাবে।"
      />
    </div>
  );
}
