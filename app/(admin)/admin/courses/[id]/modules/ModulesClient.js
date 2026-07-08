'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Edit, Trash2, HelpCircle } from 'lucide-react';

export default function ModulesClient({ course }) {
  const router = useRouter();
  const [modules, setModules] = useState(course.modules);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', contentType: 'VIDEO', videoUrl: '', pdfUrl: '', body: '' });
  const [loading, setLoading] = useState(false);

  const handleAddModule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, order: modules.length + 1 })
      });
      const data = await res.json();
      if (data.success) {
        setModules([...modules, data.module]);
        setIsAdding(false);
        setFormData({ title: '', contentType: 'VIDEO', videoUrl: '', pdfUrl: '', body: '' });
        router.refresh();
      } else {
        alert(data.error || 'Failed to add module');
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
        <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
          <Plus size={18} /> নতুন মডিউল
        </button>
      </header>

      {isAdding && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>নতুন মডিউল যোগ করুন</h2>
          <form onSubmit={handleAddModule}>
            <div className="form-group">
              <label>মডিউলের নাম</label>
              <input type="text" className="input" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            
            <div className="form-group">
              <label>কন্টেন্ট টাইপ</label>
              <select className="input" value={formData.contentType} onChange={e => setFormData({ ...formData, contentType: e.target.value })}>
                <option value="VIDEO">ভিডিও</option>
                <option value="TEXT">টেক্সট / আর্টিকেল</option>
                <option value="PDF">পিডিএফ</option>
              </select>
            </div>

            {formData.contentType === 'VIDEO' && (
              <div className="form-group">
                <label>ভিডিও লিংক (YouTube Embed URL)</label>
                <input type="url" className="input" placeholder="https://www.youtube.com/embed/..." value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} />
              </div>
            )}

            {formData.contentType === 'PDF' && (
              <div className="form-group">
                <label>পিডিএফ লিংক</label>
                <input type="url" className="input" value={formData.pdfUrl} onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })} />
              </div>
            )}

            {formData.contentType === 'TEXT' && (
              <div className="form-group">
                <label>কন্টেন্ট (HTML/Text)</label>
                <textarea className="input" rows="6" value={formData.body} onChange={e => setFormData({ ...formData, body: e.target.value })} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'যোগ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>বাতিল</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
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
                <td style={{ padding: '1rem 0' }}>{m.order || i + 1}</td>
                <td style={{ padding: '1rem 0', fontWeight: 600 }}>{m.title}</td>
                <td style={{ padding: '1rem 0' }}><span className="badge badge-earth">{m.contentType}</span></td>
                <td style={{ padding: '1rem 0' }}>{m._count?.quizzes || 0} টি</td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link href={`/admin/courses/${course.id}/modules/${m.id}/quizzes`} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent-dark)' }} title="কুইজ পরিচালনা">
                      <HelpCircle size={16} /> কুইজ
                    </Link>
                    <button onClick={() => handleDelete(m.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} title="মুছে ফেলুন">
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
