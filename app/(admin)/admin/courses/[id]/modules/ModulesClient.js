'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/Loader';
import EditCourseModal from '@/components/admin/EditCourseModal';

export default function ModulesClient({ course }) {
  const router = useRouter();
  const [modules, setModules] = useState(course.modules || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [formData, setFormData] = useState({ title: '', contentType: 'VIDEO', videoUrl: '', pdfUrl: '', pdfFile: '', body: '', quizPassMark: 80, quizDisplayCount: 20 });
  const [loading, setLoading] = useState(false);

  const openAddForm = () => {
    setIsAdding(true);
    setEditingModuleId(null);
    setFormData({ title: '', contentType: 'VIDEO', videoUrl: '', pdfUrl: '', pdfFile: '', body: '', quizPassMark: 80, quizDisplayCount: 20 });
  };

  const openEditForm = (module) => {
    setIsAdding(true);
    setEditingModuleId(module.id);
    setFormData({
      title: module.title || '',
      contentType: module.contentType || 'VIDEO',
      videoUrl: module.videoUrl || '',
      pdfUrl: module.pdfUrl || '',
      pdfFile: '',
      body: module.body || '',
      quizPassMark: module.quizPassMark || 80,
      quizDisplayCount: module.quizDisplayCount || 20
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingModuleId(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('ফাইল সাইজ 4MB এর নিচে হতে হবে');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, pdfFile: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, pdfFile: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEditing = !!editingModuleId;
      const url = isEditing 
        ? `/api/admin/courses/${course.id}/modules/${editingModuleId}`
        : `/api/admin/courses/${course.id}/modules`;
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, order: isEditing ? undefined : (modules?.length || 0) + 1 })
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error('Server returned an invalid response (not JSON). Status: ' + res.status);
      }
      if (data.success) {
        if (isEditing) {
          setModules(modules.map(m => m.id === editingModuleId ? data.module : m));
        } else {
          setModules([...modules, data.module]);
        }
        closeForm();
        router.refresh();
      } else {
        alert(data.error || 'Failed to save module');
      }
    } catch (err) {
      console.error(err);
      alert('Network error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${course.id}/modules/${moduleId}`, { method: 'DELETE' });
      if (res.ok) {
        setModules(modules.filter(m => m.id !== moduleId));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin/courses" className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '0.5rem' }}>
            <ChevronLeft size={16} /> কোর্সে ফিরে যান
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>মডিউল পরিচালনা</h1>
            <EditCourseModal course={course} onCourseUpdated={() => router.refresh()} />
            {course.finalExamEnabled && (
              <Link href={`/admin/courses/${course.id}/final-exam`} className="btn btn-outline btn-sm" style={{ marginLeft: '1rem' }}>
                ফাইনাল পরীক্ষা কুইজ
              </Link>
            )}
          </div>
          <p style={{ color: 'var(--color-text-muted)' }}>{course.title}</p>
        </div>
        {!isAdding && (
          <button onClick={openAddForm} className="btn btn-primary">
            <Plus size={18} /> নতুন মডিউল
          </button>
        )}
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '2rem' }}
          >
            <div className="card" style={{ padding: '2rem', border: '1px solid var(--color-primary-light)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                {editingModuleId ? 'মডিউল আপডেট করুন' : 'নতুন মডিউল যোগ করুন'}
              </h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="grid-2 gap-4">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">মডিউলের নাম</label>
                    <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="মডিউলের নাম লিখুন" />
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">কন্টেন্ট টাইপ</label>
                    <select className="form-input form-select" value={formData.contentType} onChange={e => setFormData({ ...formData, contentType: e.target.value })}>
                      <option value="VIDEO">ভিডিও</option>
                      <option value="TEXT">টেক্সট / আর্টিকেল</option>
                      <option value="PDF">পিডিএফ</option>
                    </select>
                  </div>
                </div>

                {formData.contentType === 'VIDEO' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">ভিডিও লিংক (YouTube Embed URL)</label>
                    <input type="url" className="form-input" placeholder="https://www.youtube.com/embed/..." value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} />
                  </div>
                )}

                {formData.contentType === 'PDF' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">পিডিএফ আপলোড করুন</label>
                    <input type="file" accept="application/pdf" className="form-input" onChange={handleFileChange} />
                    {formData.pdfUrl && !formData.pdfFile && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        বর্তমান পিডিএফ: <a href={formData.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>দেখুন</a>
                      </div>
                    )}
                  </div>
                )}

                {formData.contentType === 'TEXT' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">কন্টেন্ট (HTML/Text)</label>
                    <textarea className="form-input" rows="6" value={formData.body} onChange={e => setFormData({ ...formData, body: e.target.value })} placeholder="এখানে কন্টেন্ট লিখুন..." />
                  </div>
                )}

                <div className="grid-2 gap-4">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">কুইজ পাস মার্ক (%)</label>
                    <input type="number" className="form-input" min="0" max="100" value={formData.quizPassMark} onChange={e => setFormData({ ...formData, quizPassMark: parseInt(e.target.value) || 0 })} placeholder="e.g. 80" />
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">প্রদর্শিত প্রশ্নের সংখ্যা</label>
                    <input type="number" className="form-input" min="1" value={formData.quizDisplayCount} onChange={e => setFormData({ ...formData, quizDisplayCount: parseInt(e.target.value) || 1 })} placeholder="e.g. 20" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <Loader variant="button" text="সংরক্ষণ হচ্ছে..." /> : 'সংরক্ষণ করুন'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={closeForm} disabled={loading}>বাতিল</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card" style={{ padding: '1.5rem' }}>
        <table className="mobile-card-list" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: '1rem 0' }}>ক্রমিক</th>
              <th style={{ padding: '1rem 0' }}>নাম</th>
              <th style={{ padding: '1rem 0' }}>টাইপ</th>
              <th style={{ padding: '1rem 0' }}>কুইজ</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m, i) => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                <td data-label="ক্রমিক" style={{ padding: '1rem 0' }}>{m.order || i + 1}</td>
                <td data-label="নাম" style={{ padding: '1rem 0', fontWeight: 600 }}>{m.title}</td>
                <td data-label="টাইপ" style={{ padding: '1rem 0' }}><span className="badge badge-earth">{m.contentType}</span></td>
                <td data-label="কুইজ" style={{ padding: '1rem 0' }}>{m._count?.quizzes || 0} টি</td>
                <td data-label="অ্যাকশন" style={{ padding: '1rem 0', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <Link href={`/admin/courses/${course.id}/modules/${m.id}/quizzes`} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent-dark)', minWidth: '44px', minHeight: '44px' }} title="কুইজ পরিচালনা">
                      <HelpCircle size={16} /> কুইজ
                    </Link>
                    <button onClick={() => openEditForm(m)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)', minWidth: '44px', minHeight: '44px' }} title="এডিট করুন">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)', minWidth: '44px', minHeight: '44px' }} title="মুছে ফেলুন">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {modules.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো মডিউল নেই।</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
