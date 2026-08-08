'use client';
import { useState, useEffect } from 'react';
import { Users, Edit, Trash2, Plus, Search, Upload, X } from 'lucide-react';
import Loader from '@/components/ui/Loader';

function InstructorModal({ isOpen, onClose, onSaved, instructor }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', avatarUrl: '' });

  useEffect(() => {
    if (isOpen) {
      if (instructor) {
        setForm({
          name: instructor.name || '',
          title: instructor.title || '',
          avatarUrl: instructor.avatarUrl || ''
        });
      } else {
        setForm({ name: '', title: '', avatarUrl: '' });
      }
    }
  }, [isOpen, instructor]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const isEdit = !!instructor;
    const url = isEdit ? `/api/admin/instructors/${instructor.id}` : '/api/admin/instructors';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        onClose();
        onSaved();
      } else {
        const d = await res.json();
        alert(d.error || 'ত্রুটি হয়েছে');
      }
    } catch (err) {
      alert('নেটওয়ার্ক ত্রুটি');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--color-surface)', width: '100%', maxWidth: '500px',
        borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-earth-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{instructor ? 'শিক্ষক আপডেট করুন' : 'নতুন শিক্ষক যোগ করুন'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">নাম *</label>
              <input 
                className="form-input" 
                value={form.name} 
                onChange={e => setForm(p => ({...p, name: e.target.value}))} 
                required 
                placeholder="যেমন: শায়খ আব্দুর রহমান"
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">পদবি / উপাধি</label>
              <input 
                className="form-input" 
                value={form.title} 
                onChange={e => setForm(p => ({...p, title: e.target.value}))} 
                placeholder="যেমন: খতিব, কেন্দ্রীয় মসজিদ"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">ছবি (Avatar URL)</label>
              <input 
                className="form-input" 
                value={form.avatarUrl} 
                onChange={e => setForm(p => ({...p, avatarUrl: e.target.value}))} 
                placeholder="https://example.com/image.jpg"
              />
              {form.avatarUrl && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={form.avatarUrl} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>প্রিভিউ</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>বাতিল</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/instructors');
      if (res.ok) {
        const data = await res.json();
        setInstructors(data.instructors || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই শিক্ষককে মুছে ফেলতে চান? উনার যুক্ত করা কোর্সগুলো মেন্টর-বিহীন হয়ে যাবে।')) return;
    
    try {
      const res = await fetch(`/api/admin/instructors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchInstructors();
      } else {
        alert('মুছে ফেলতে সমস্যা হয়েছে');
      }
    } catch (e) {
      alert('নেটওয়ার্ক সমস্যা');
    }
  };

  const openAdd = () => {
    setEditingInstructor(null);
    setIsModalOpen(true);
  };

  const openEdit = (instructor) => {
    setEditingInstructor(instructor);
    setIsModalOpen(true);
  };

  const filteredInstructors = instructors.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>শিক্ষক ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>সকল শিক্ষকদের তালিকা ও বিবরণ</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> নতুন শিক্ষক
        </button>
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', maxWidth: '400px', flex: 1 }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="শিক্ষকের নাম দিয়ে খুঁজুন..." 
              style={{ paddingLeft: '2.5rem' }} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="mobile-card-list" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>শিক্ষক</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>পদবি</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredInstructors.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center' }}>
                    <Loader variant="section" text="লোড হচ্ছে..." />
                  </td>
                </tr>
              ) : filteredInstructors.length === 0 ? (
                <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো শিক্ষক পাওয়া যায়নি।</td></tr>
              ) : (
                filteredInstructors.map((instructor) => (
                  <tr key={instructor.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                    <td data-label="শিক্ষক" style={{ padding: '1rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {instructor.avatarUrl ? (
                          <img src={instructor.avatarUrl} alt={instructor.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-primary-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 700 }}>
                            {instructor.name.charAt(0)}
                          </div>
                        )}
                        <div style={{ fontWeight: 600 }}>{instructor.name}</div>
                      </div>
                    </td>
                    <td data-label="পদবি" style={{ padding: '1rem 0', color: 'var(--color-text-muted)' }}>
                      {instructor.title || '-'}
                    </td>
                    <td data-label="অ্যাকশন" style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEdit(instructor)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} title="এডিট করুন">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(instructor.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} title="মুছে ফেলুন">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InstructorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchInstructors}
        instructor={editingInstructor}
      />
    </div>
  );
}
