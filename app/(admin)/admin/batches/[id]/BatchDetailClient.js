'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Users, BookOpen, Lock, Unlock, UserPlus, Trash2, Plus, CheckCircle2, XCircle, Loader2, Trophy } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'UPCOMING', label: 'আসন্ন' },
  { value: 'ENROLLING', label: 'ভর্তি চলছে' },
  { value: 'ACTIVE', label: 'সক্রিয়' },
  { value: 'COMPLETED', label: 'সম্পন্ন' },
  { value: 'ARCHIVED', label: 'আর্কাইভ' },
];
const STATUS_COLORS = {
  UPCOMING: '#6b7280', ENROLLING: '#16a34a', ACTIVE: 'var(--color-primary)',
  COMPLETED: '#9333ea', ARCHIVED: '#9ca3af',
};

export default function BatchDetailClient({ batch: initialBatch }) {
  const [batch, setBatch] = useState(initialBatch);
  const [tab, setTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [addingCourse, setAddingCourse] = useState(false);

  const fetchStudents = useCallback(async () => {
    const res = await fetch(`/api/admin/batches/${batch.id}/students`);
    if (res.ok) setStudents(await res.json());
  }, [batch.id]);

  const fetchCourses = useCallback(async () => {
    const res = await fetch(`/api/admin/batches/${batch.id}/courses`);
    if (res.ok) setCourses(await res.json());
  }, [batch.id]);

  const fetchAllCourses = useCallback(async () => {
    const res = await fetch('/api/admin/courses');
    if (res.ok) {
      const data = await res.json();
      setAllCourses(data.courses || []);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchCourses(), fetchAllCourses()]);
      setLoading(false);
    };
    load();
  }, [fetchStudents, fetchCourses, fetchAllCourses]);

  const updateBatch = async (data) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/batches/${batch.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (res.ok) setBatch(prev => ({ ...prev, ...data }));
    } finally { setSaving(false); }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!addEmail.trim()) return;
    setAddingStudent(true);
    try {
      const res = await fetch(`/api/admin/batches/${batch.id}/students`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: addEmail.trim() })
      });
      const data = await res.json();
      if (res.ok) { setAddEmail(''); fetchStudents(); }
      else alert(data.error || 'ত্রুটি হয়েছে');
    } finally { setAddingStudent(false); }
  };

  const handleRemoveStudent = async (userId) => {
    if (!confirm('এই শিক্ষার্থীকে ব্যাচ থেকে সরাতে চান?')) return;
    await fetch(`/api/admin/batches/${batch.id}/students`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId })
    });
    fetchStudents();
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    setAddingCourse(true);
    try {
      const res = await fetch(`/api/admin/batches/${batch.id}/courses`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: selectedCourseId })
      });
      if (res.ok) { setSelectedCourseId(''); fetchCourses(); }
      else { const d = await res.json(); alert(d.error || 'ত্রুটি'); }
    } finally { setAddingCourse(false); }
  };

  const handleRemoveCourse = async (courseId) => {
    if (!confirm('এই কোর্সটি ব্যাচ থেকে সরাতে চান?')) return;
    await fetch(`/api/admin/batches/${batch.id}/courses`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId })
    });
    fetchCourses();
  };

  const assignedCourseIds = new Set(courses.map(bc => bc.courseId));
  const availableCourses = allCourses.filter(c => !assignedCourseIds.has(c.id));
  const stColor = STATUS_COLORS[batch.status] || '#6b7280';

  return (
    <div>
      {/* Header */}
      <header style={{ marginBottom: '1.5rem' }}>
        <Link href="/admin/batches" className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '0.75rem' }}>
          <ChevronLeft size={16} /> সকল ব্যাচ
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{batch.name}</h1>
            {batch.description && <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{batch.description}</p>}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Selector */}
            <select className="form-input form-select" style={{ width: 'auto', fontWeight: 600, color: stColor, borderColor: stColor }}
              value={batch.status} onChange={e => updateBatch({ status: e.target.value })} disabled={saving}>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {/* Lock/Unlock toggle */}
            <button className={`btn ${batch.coursesLocked ? 'btn-outline' : 'btn-primary'}`}
              onClick={() => updateBatch({ coursesLocked: !batch.coursesLocked })} disabled={saving}
              style={{ gap: '0.5rem' }}>
              {batch.coursesLocked ? <><Lock size={16} /> কোর্স লক</> : <><Unlock size={16} /> কোর্স আনলক</>}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        <button className={`tab ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>
          <Users size={16} style={{ display: 'inline', marginRight: '6px' }} />শিক্ষার্থী ({students.length})
        </button>
        <button className={`tab ${tab === 'courses' ? 'active' : ''}`} onClick={() => setTab('courses')}>
          <BookOpen size={16} style={{ display: 'inline', marginRight: '6px' }} />কোর্স ({courses.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />লোড হচ্ছে...
        </div>
      ) : tab === 'students' ? (
        <div>
          {/* Add student form */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                <label className="form-label">ইমেইল দিয়ে শিক্ষার্থী যোগ করুন</label>
                <input className="form-input" type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} placeholder="student@example.com" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={addingStudent} style={{ flexShrink: 0 }}>
                {addingStudent ? <Loader2 size={16} className="spin" /> : <UserPlus size={16} />} যোগ করুন
              </button>
            </form>
          </div>

          {/* Students list */}
          <div className="card" style={{ padding: '1rem' }}>
            {students.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <Users size={32} /><p>কোনো শিক্ষার্থী নেই।</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }} className="mobile-card-list">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>নাম</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>মোবাইল</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>ভর্তির তারিখ</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>কোর্স এনরোলমেন্ট</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(bs => (
                    <tr key={bs.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                      <td data-label="নাম" style={{ padding: '0.75rem 0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{bs.user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{bs.user.email}</div>
                      </td>
                      <td data-label="মোবাইল" style={{ padding: '0.75rem 0.5rem' }}>{bs.user.mobile}</td>
                      <td data-label="ভর্তির তারিখ" style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {new Date(bs.enrolledAt).toLocaleDateString('bn-BD')}
                      </td>
                      <td data-label="কোর্স এনরোলমেন্ট" style={{ padding: '0.75rem 0.5rem' }}>
                        {(bs.user.enrollments?.length || 0) > 0 ? (
                          <span style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: 600 }}>
                            <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />{bs.user.enrollments.length} কোর্স চলমান
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                            <XCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />শুরু করেননি
                          </span>
                        )}
                      </td>
                      <td data-label="অ্যাকশন" style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <button onClick={() => handleRemoveStudent(bs.user.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Assign course form */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <form onSubmit={handleAssignCourse} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                <label className="form-label">কোর্স অ্যাসাইন করুন</label>
                <select className="form-input form-select" value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}>
                  <option value="">কোর্স নির্বাচন করুন</option>
                  {availableCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={addingCourse || !selectedCourseId} style={{ flexShrink: 0 }}>
                {addingCourse ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} যোগ করুন
              </button>
            </form>
          </div>

          {/* Course list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.length === 0 ? (
              <div className="empty-state"><BookOpen size={32} /><p>কোনো কোর্স নেই।</p></div>
            ) : courses.map(bc => (
              <div key={bc.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{bc.course.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {bc.course.type === 'PAID' ? 'পেইড' : 'ফ্রি'} • {bc.course.level}
                      {' • '}
                      <Link href={`/admin/courses/${bc.course.id}/subjects`} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>সাবজেক্ট দেখুন →</Link>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Link href={`/admin/courses/${bc.course.id}/leaderboard`} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent-dark)' }}>
                    <Trophy size={15} /> লিডারবোর্ড
                  </Link>
                  <button onClick={() => handleRemoveCourse(bc.courseId)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
