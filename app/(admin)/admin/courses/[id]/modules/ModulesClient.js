'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/Loader';

export default function ModulesClient({ course }) {
  const router = useRouter();
  const [modules, setModules] = useState(course.modules);
  const [isAdding, setIsAdding] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [formData, setFormData] = useState({ title: '', contentType: 'VIDEO', videoUrl: '', pdfUrl: '', body: '' });
  const [loading, setLoading] = useState(false);

  const openAddForm = () => {
    setIsAdding(true);
    setEditingModuleId(null);
    setFormData({ title: '', contentType: 'VIDEO', videoUrl: '', pdfUrl: '', body: '' });
  };

  const openEditForm = (module) => {
    setIsAdding(true);
    setEditingModuleId(module.id);
    setFormData({
      title: module.title || '',
      contentType: module.contentType || 'VIDEO',
      videoUrl: module.videoUrl || '',
      pdfUrl: module.pdfUrl || '',
      body: module.body || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingModuleId(null);
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
        body: JSON.stringify({ ...formData, order: isEditing ? undefined : modules.length + 1 })
      });
      const data = await res.json();
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
      alert('Network error');
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>মডিউল পরিচালনা</h1>
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
                    <label className="form-label">পিডিএফ লিংক</label>
                    <input type="url" className="form-input" placeholder="https://..." value={formData.pdfUrl} onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })} />
                  </div>
                )}

                {formData.contentType === 'TEXT' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">কন্টেন্ট (HTML/Text)</label>
                    <textarea className="form-input" rows="6" value={formData.body} onChange={e => setFormData({ ...formData, body: e.target.value })} placeholder="এখানে কন্টেন্ট লিখুন..." />
                  </div>
                )}

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
