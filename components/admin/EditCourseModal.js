'use client';
import { useState, useEffect } from 'react';
import { Edit, X, Upload } from 'lucide-react';

export default function EditCourseModal({ course, onCourseUpdated }) {
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
    finalExamEnabled: false,
    finalExamPassMark: 80,
    finalExamDisplayCount: 20,
    coverImageFile: null,
    coverImagePreview: null,
  });

  useEffect(() => {
    if (open) {
      if (instructors.length === 0) {
        fetch('/api/admin/instructors')
          .then(res => res.json())
          .then(data => setInstructors(data.instructors || []));
      }
      
      // Populate form with existing course data
      setForm({
        title: course.title || '',
        description: course.description || '',
        level: course.level || 'Beginner',
        type: course.type || 'FREE',
        price: course.price || '',
        duration: course.duration || '',
        instructorId: course.instructorId || '',
        tags: course.tags && Array.isArray(course.tags) ? course.tags.join(', ') : (course.tags || ''),
        finalExamEnabled: course.finalExamEnabled || false,
        finalExamPassMark: course.finalExamPassMark || 80,
        finalExamDisplayCount: course.finalExamDisplayCount || 20,
        coverImageFile: null,
        coverImagePreview: course.coverImageUrl || null,
      });
    }
  }, [open, course]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(p => ({ ...p, coverImageFile: reader.result, coverImagePreview: URL.createObjectURL(file) }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.instructorId) {
      alert('শিরোনাম, বর্ণনা এবং শিক্ষক আবশ্যক');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        finalExamPassMark: parseInt(form.finalExamPassMark) || 80,
        finalExamDisplayCount: parseInt(form.finalExamDisplayCount) || 20,
      };

      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setOpen(false);
        if (onCourseUpdated) onCourseUpdated();
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
      <button 
        onClick={() => setOpen(true)} 
        className="btn btn-ghost btn-sm" 
        style={{ padding: '0.5rem', minWidth: '44px', minHeight: '44px', color: 'var(--color-primary)' }} 
        title="এডিট করুন"
      >
        <Edit size={16} />
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>কোর্স আপডেট করুন</h2>
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
                  <label className="form-label">শিক্ষক *</label>
                  <select name="instructorId" value={form.instructorId} onChange={handleChange} className="form-input" required>
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

                <div style={{ borderTop: '1px solid var(--color-earth-1)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>ফাইনাল পরীক্ষা সেটিংস</h3>
                  
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input type="checkbox" id="finalExamEnabled" name="finalExamEnabled" checked={form.finalExamEnabled} onChange={handleChange} style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }} />
                    <label htmlFor="finalExamEnabled" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>ফাইনাল পরীক্ষা চালু করুন</label>
                  </div>

                  {form.finalExamEnabled && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">পাস মার্ক (%)</label>
                        <input type="number" name="finalExamPassMark" value={form.finalExamPassMark} onChange={handleChange} className="form-input" min="0" max="100" placeholder="e.g. 80" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">প্রদর্শিত প্রশ্নের সংখ্যা</label>
                        <input type="number" name="finalExamDisplayCount" value={form.finalExamDisplayCount} onChange={handleChange} className="form-input" min="1" placeholder="e.g. 20" />
                      </div>
                    </div>
                  )}
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
