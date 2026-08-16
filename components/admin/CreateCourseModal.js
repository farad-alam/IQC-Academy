'use client';
import { useState, useEffect } from 'react';
import { Plus, X, Upload } from 'lucide-react';

export default function CreateCourseModal({ onCourseCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    type: 'FREE',
    price: '',
    duration: '',
    instructorId: '',
    tags: '',
    isBatchCourse: false,
    coverImageFile: null,
    coverImagePreview: null
  });

  useEffect(() => {
    if (open && instructors.length === 0) {
      fetch('/api/admin/instructors')
        .then(res => res.json())
        .then(data => setInstructors(data.instructors || []));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(p => ({ ...p, coverImageFile: reader.result, coverImagePreview: URL.createObjectURL(file) }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert('শিরোনাম এবং বর্ণনা আবশ্যক');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        instructorId: form.instructorId || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setOpen(false);
        setForm({
          title: '', description: '', level: 'Beginner', type: 'FREE',
          price: '', duration: '', instructorId: '', tags: '',
          isBatchCourse: false,
          coverImageFile: null, coverImagePreview: null
        });
        if (onCourseCreated) onCourseCreated();
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
        <Plus size={16} /> নতুন কোর্স
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>নতুন কোর্স তৈরি করুন</h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">কোর্সের নাম *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="যেমন: আল-কুরআন শিক্ষা" required />
                </div>
                
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--color-surface-alt)', borderRadius: '8px', border: '1px solid var(--color-earth-2)' }}>
                  <input type="checkbox" id="isBatchCourse-create" name="isBatchCourse" checked={form.isBatchCourse} onChange={e => setForm(p => ({ ...p, isBatchCourse: e.target.checked }))} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
                  <label htmlFor="isBatchCourse-create" style={{ fontWeight: 600, cursor: 'pointer', margin: 0, fontSize: '0.95rem' }}>এটি একটি ব্যাচ কোর্স (পাবলিকলি দেখা যাবে না)</label>
                </div>
                
                <div className="form-group">
                  <label className="form-label">বর্ণনা *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="form-input" placeholder="কোর্সের বিস্তারিত..." rows="3" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">লেভেল</label>
                    <select name="level" value={form.level} onChange={handleChange} className="form-input">
                      <option value="Beginner">প্রাথমিক</option>
                      <option value="Intermediate">মাধ্যমিক</option>
                      <option value="Advanced">উচ্চতর</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">কোর্সের ধরন</label>
                    <select name="type" value={form.type} onChange={handleChange} className="form-input">
                      <option value="FREE">ফ্রি</option>
                      <option value="PAID">পেইড</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">মূল্য (৳)</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} className="form-input" placeholder="ফ্রি হলে ফাঁকা রাখুন" disabled={form.type === 'FREE'} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">মেয়াদ / মোট সময়</label>
                    <input name="duration" value={form.duration} onChange={handleChange} className="form-input" placeholder="যেমন: ২ মাস / ১২ ঘন্টা" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">শিক্ষক (ঐচ্ছিক)</label>
                  <select name="instructorId" value={form.instructorId} onChange={handleChange} className="form-input">
                    <option value="">নির্বাচন করুন</option>
                    {instructors.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">ট্যাগসমূহ</label>
                  <input name="tags" value={form.tags} onChange={handleChange} className="form-input" placeholder="কমা দিয়ে লিখুন (যেমন: কুরআন, তাজবিদ)" />
                </div>
                <div className="form-group">
                  <label className="form-label">কোর্সের ছবি (থাম্বনেইল) - ঐচ্ছিক</label>
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed var(--color-earth-2)', borderRadius: '8px', padding: '1.5rem',
                    cursor: 'pointer', backgroundColor: 'var(--color-bg)', transition: 'border-color 0.2s',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    {form.coverImagePreview ? (
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                        <img src={form.coverImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                          <span style={{ color: 'white', fontWeight: 500 }}><Upload size={16} style={{ display: 'inline', marginRight: '4px' }} /> পরিবর্তন করুন</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>ছবি আপলোড করুন</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>বা এখানে ড্র্যাগ এন্ড ড্রপ করুন</span>
                      </>
                    )}
                    <input type="file" name="coverImageFile" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
                  </label>
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
