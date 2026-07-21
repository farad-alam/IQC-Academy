'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Edit, Trash2 } from 'lucide-react';
import CreateCourseModal from '@/components/admin/CreateCourseModal';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই কোর্সটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCourses();
      else alert('ডিলিট করতে সমস্যা হয়েছে');
    } catch {
      alert('নেটওয়ার্ক সমস্যা');
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>কোর্স ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>সকল কোর্সের তালিকা ও নিয়ন্ত্রণ</p>
        </div>
        <CreateCourseModal onCourseCreated={fetchCourses} />
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', maxWidth: '400px', flex: 1 }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="কোর্সের নাম দিয়ে খুঁজুন..." 
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
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>কোর্সের নাম</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>শিক্ষক</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>মূল্য</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>মডিউল সংখ্যা</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>শিক্ষার্থী সংখ্যা</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>স্ট্যাটাস</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div className="spinner spinner-sm" style={{ margin: '0 auto 1rem', borderColor: 'var(--color-primary)', borderRightColor: 'transparent' }} />
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো কোর্স পাওয়া যায়নি।</td></tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                    <td data-label="কোর্সের নাম" style={{ padding: '1rem 0', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{course.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{course.level}</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="শিক্ষক" style={{ padding: '1rem 0' }}>{course.instructor?.name || '-'}</td>
                    <td data-label="মূল্য" style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--color-primary)' }}>
                      {course.type === 'PAID' && course.price > 0 ? `৳${course.price}` : 'ফ্রি'}
                    </td>
                    <td data-label="মডিউল সংখ্যা" style={{ padding: '1rem 0' }}>{course._count?.modules || 0} টি</td>
                    <td data-label="শিক্ষার্থী সংখ্যা" style={{ padding: '1rem 0' }}>{course._count?.enrollments || 0} জন</td>
                    <td data-label="স্ট্যাটাস" style={{ padding: '1rem 0' }}>
                      <span className={`badge ${course.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>
                        {course.status === 'PUBLISHED' ? 'প্রকাশিত' : 'ড্রাফট'}
                      </span>
                    </td>
                    <td data-label="অ্যাকশন" style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <button 
                          className="btn btn-ghost btn-sm" 
                          style={{ padding: '0.5rem', minWidth: '44px', minHeight: '44px', color: course.status === 'PUBLISHED' ? 'var(--color-warning)' : 'var(--color-success)' }} 
                          title={course.status === 'PUBLISHED' ? 'ড্রাফট করুন' : 'প্রকাশ করুন'}
                          onClick={async () => {
                            try {
                              const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
                              const res = await fetch(`/api/admin/courses/${course.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: newStatus })
                              });
                              if (res.ok) fetchCourses();
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                        >
                          {course.status === 'PUBLISHED' ? 'ড্রাফট' : 'প্রকাশ'}
                        </button>
                        <Link href={`/admin/courses/${course.id}/modules`} className="btn btn-ghost btn-sm" style={{ padding: '0.5rem', minWidth: '44px', minHeight: '44px', color: 'var(--color-primary)' }} title="মডিউল পরিচালনা">
                          <Edit size={16} />
                        </Link>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem', minWidth: '44px', minHeight: '44px', color: 'var(--color-error)' }} title="মুছে ফেলুন" onClick={() => handleDelete(course.id)}>
                          <Trash2 size={16} />
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
    </div>
  );
}
