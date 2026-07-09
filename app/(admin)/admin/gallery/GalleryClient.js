'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/Loader';

export default function GalleryClient({ initialItems }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'event', // event, class, project
    date: new Date().toISOString().split('T')[0],
    file: null, // base64 string
    fileName: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ফাইল সাইজ ৫ এমবি এর বেশি হতে পারবে না');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, file: reader.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert('অনুগ্রহ করে একটি ছবি নির্বাচন করুন');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setItems([data.item, ...items]);
        setIsAdding(false);
        setFormData({ title: '', type: 'event', date: new Date().toISOString().split('T')[0], file: null, fileName: '' });
        router.refresh();
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      alert('Network error during upload');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে ছবিটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter(i => i.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'event': return 'ইভেন্ট';
      case 'class': return 'ক্লাস';
      case 'project': return 'প্রজেক্ট';
      default: return type;
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>গ্যালারি পরিচালনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>ওয়েবসাইটের গ্যালারি সেকশনের ছবি ম্যানেজ করুন</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn btn-primary">
            <Plus size={18} /> ছবি যোগ করুন
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>নতুন ছবি আপলোড করুন</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="grid-2 gap-4">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">ছবির শিরোনাম</label>
                    <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="যেমন: কুইজ প্রতিযোগিতা" />
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">ক্যাটাগরি</label>
                    <select className="form-input form-select" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                      <option value="event">ইভেন্ট</option>
                      <option value="class">ক্লাস</option>
                      <option value="project">প্রজেক্ট</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2 gap-4">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">তারিখ</label>
                    <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">ছবি নির্বাচন করুন (Max 5MB)</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
                    <label htmlFor="file-upload" style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem',
                      border: '1px dashed var(--color-primary)', borderRadius: '8px', cursor: 'pointer',
                      backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)'
                    }}>
                      <ImageIcon size={18} />
                      {formData.fileName ? formData.fileName : 'ছবি ব্রাউজ করুন'}
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <Loader variant="button" text="আপলোড হচ্ছে..." /> : 'আপলোড করুন'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)} disabled={loading}>বাতিল</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {items.map(item => (
          <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: 'var(--color-earth-1)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => handleDelete(item.id)} 
                className="btn btn-ghost" 
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: 'var(--color-error)', padding: '0.5rem' }} 
                title="মুছে ফেলুন"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <span>{getTypeLabel(item.type)}</span>
                <span>{new Date(item.date).toLocaleDateString('bn-BD')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          গ্যালারিতে কোনো ছবি নেই। নতুন ছবি আপলোড করুন।
        </div>
      )}
    </div>
  );
}
