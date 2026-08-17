'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Users, BookOpen, Lock, Unlock, UserPlus, Trash2, Plus, CheckCircle2, XCircle, Loader2, Trophy, BarChart2, Phone, ChevronDown, ChevronRight, Clock, Award, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProtectedDeleteModal from '@/components/admin/ProtectedDeleteModal';

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
  const router = useRouter();
  const [batch, setBatch] = useState(initialBatch);
  const [tab, setTab] = useState('students');
  const [progressData, setProgressData] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressFilter, setProgressFilter] = useState('ALL');
  const [expandedStudents, setExpandedStudents] = useState(new Set());
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [addingCourse, setAddingCourse] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);

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

  const fetchProgress = useCallback(async () => {
    setProgressLoading(true);
    const res = await fetch(`/api/admin/batches/${batch.id}/progress`);
    if (res.ok) setProgressData(await res.json());
    setProgressLoading(false);
  }, [batch.id]);

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

  const confirmDeleteBatch = async (securityKey) => {
    try {
      const res = await fetch(`/api/admin/batches/${batch.id}`, { 
        method: 'DELETE',
        headers: { 'x-deletion-key': securityKey }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('ব্যাচটি সফলভাবে মুছে ফেলা হয়েছে');
        setIsDeletingBatch(false);
        router.push('/admin/batches');
        router.refresh();
      } else {
        toast.error(data.error || 'মুছে ফেলতে সমস্যা হয়েছে');
      }
    } catch (err) {
      toast.error('নেটওয়ার্ক সমস্যা');
    }
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
            <button className="btn btn-outline" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }} onClick={() => setIsDeletingBatch(true)} title="ব্যাচ মুছুন">
              <Trash2 size={16} /> ব্যাচ মুছুন
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
        <button className={`tab ${tab === 'monitoring' ? 'active' : ''}`} onClick={() => { setTab('monitoring'); if (progressData.length === 0) fetchProgress(); }}>
          <BarChart2 size={16} style={{ display: 'inline', marginRight: '6px' }} />মনিটরিং
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
      ) : tab === 'courses' ? (
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
      ) : tab === 'monitoring' ? (
        <MonitoringTab
          progressData={progressData}
          progressLoading={progressLoading}
          progressFilter={progressFilter}
          setProgressFilter={setProgressFilter}
          expandedStudents={expandedStudents}
          setExpandedStudents={setExpandedStudents}
          onRefresh={fetchProgress}
        />
      ) : null}

      <ProtectedDeleteModal 
        isOpen={isDeletingBatch}
        onClose={() => setIsDeletingBatch(false)}
        onConfirm={confirmDeleteBatch}
        title="ব্যাচ মুছে ফেলুন"
        message="আপনি কি নিশ্চিত যে এই ব্যাচটি মুছে ফেলতে চান? এর সাথে যুক্ত সকল কোর্সের অ্যাসাইনমেন্ট ও শিক্ষার্থীদের এনরোলমেন্ট মুছে যাবে (তবে মূল কোর্স ও শিক্ষার্থীদের প্রোফাইল ঠিক থাকবে)।"
      />
    </div>
  );
}

// ─── Status helpers ────────────────────────────────────────────────────────────
const STATUS_META = {
  NOT_STARTED: { label: 'শুরু করেননি', color: '#ef4444', bg: '#fef2f2', icon: '🔴' },
  STUCK:       { label: 'অগ্রগতি নেই', color: '#f97316', bg: '#fff7ed', icon: '🟠' },
  IN_PROGRESS: { label: 'চলমান',        color: '#3b82f6', bg: '#eff6ff', icon: '🔵' },
  COMPLETED:   { label: 'সম্পন্ন',      color: '#16a34a', bg: '#f0fdf4', icon: '🟢' },
};

function relativeTime(date) {
  if (!date) return 'কোনো কার্যক্রম নেই';
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'এইমাত্র';
  if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ঘন্টা আগে`;
  const days = Math.floor(diff / 86400);
  return `${days} দিন আগে`;
}

function ProgressBar({ value, total, color = 'var(--color-primary)' }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'var(--color-earth-1)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.3s ease' }} />
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', minWidth: '60px', textAlign: 'right' }}>
        {value}/{total} ({pct}%)
      </span>
    </div>
  );
}

function ExamBadge({ exam }) {
  if (!exam?.enabled) return null;
  if (!exam.taken) return (
    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '20px', background: '#f3f4f6', color: '#6b7280', fontWeight: 600 }}>
      🔘 পরীক্ষা দেওয়া হয়নি
    </span>
  );
  if (exam.passed) return (
    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '20px', background: '#dcfce7', color: '#16a34a', fontWeight: 600 }}>
      ✅ পাস: {exam.score}/{exam.total}
    </span>
  );
  return (
    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '20px', background: '#fee2e2', color: '#dc2626', fontWeight: 600 }}>
      ❌ ফেল: {exam.score}/{exam.total} (পাস মার্ক: {exam.passMark})
    </span>
  );
}

function MonitoringTab({ progressData, progressLoading, progressFilter, setProgressFilter, expandedStudents, setExpandedStudents, onRefresh }) {
  const toggleExpand = (id) => {
    setExpandedStudents(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const counts = {
    ALL: progressData.length,
    NOT_STARTED: progressData.filter(s => s.overallStatus === 'NOT_STARTED').length,
    STUCK:       progressData.filter(s => s.overallStatus === 'STUCK').length,
    IN_PROGRESS: progressData.filter(s => s.overallStatus === 'IN_PROGRESS').length,
    COMPLETED:   progressData.filter(s => s.overallStatus === 'COMPLETED').length,
  };

  const filtered = progressFilter === 'ALL' ? progressData : progressData.filter(s => s.overallStatus === progressFilter);

  if (progressLoading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
      <div className="spinner" style={{ margin: '0 auto 1rem' }} />ডেটা লোড হচ্ছে...
    </div>
  );

  return (
    <div>
      {/* Summary bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'ALL', label: `সবাই (${counts.ALL})`, color: 'var(--color-text)', bg: 'var(--color-surface-alt)' },
              { key: 'NOT_STARTED', label: `🔴 শুরু করেননি (${counts.NOT_STARTED})`, color: '#ef4444', bg: '#fef2f2' },
              { key: 'STUCK', label: `🟠 অগ্রগতি নেই (${counts.STUCK})`, color: '#f97316', bg: '#fff7ed' },
              { key: 'IN_PROGRESS', label: `🔵 চলমান (${counts.IN_PROGRESS})`, color: '#3b82f6', bg: '#eff6ff' },
              { key: 'COMPLETED', label: `🟢 সম্পন্ন (${counts.COMPLETED})`, color: '#16a34a', bg: '#f0fdf4' },
            ].map(f => (
              <button key={f.key} onClick={() => setProgressFilter(f.key)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, border: `2px solid ${progressFilter === f.key ? f.color : 'transparent'}`, background: progressFilter === f.key ? f.bg : 'var(--color-surface-alt)', color: progressFilter === f.key ? f.color : 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
                {f.label}
              </button>
            ))}
          </div>
          <button onClick={onRefresh} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
            🔄 রিফ্রেশ
          </button>
        </div>
      </div>

      {/* Student cards */}
      {filtered.length === 0 ? (
        <div className="empty-state"><Users size={32} /><p>এই ফিল্টারে কোনো শিক্ষার্থী নেই।</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {filtered.map(student => {
            const meta = STATUS_META[student.overallStatus];
            const isExpanded = expandedStudents.has(student.userId);
            return (
              <div key={student.userId} className="card" style={{ overflow: 'hidden', borderLeft: `4px solid ${meta.color}` }}>
                {/* Student header — always visible */}
                <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Avatar */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${meta.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: meta.color, flexShrink: 0 }}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{student.name}</span>
                      <span style={{ padding: '0.15rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: meta.bg, color: meta.color }}>{meta.icon} {meta.label}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <span>{student.email}</span>
                      {student.mobile && (
                        <a href={`tel:${student.mobile}`} style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Phone size={12} /> {student.mobile}
                        </a>
                      )}
                      {student.institution && <span>🏫 {student.institution}</span>}
                      {student.district && <span>📍 {student.district}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                      <span><Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />শেষ কার্যক্রম: <strong>{relativeTime(student.lastActivityAt)}</strong></span>
                      <span>ভর্তি: <strong>{new Date(student.batchJoinedAt).toLocaleDateString('bn-BD')}</strong></span>
                    </div>
                  </div>
                  {/* Overall progress & expand button */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      সামগ্রিক অগ্রগতি: {student.completedModulesAcrossAll}/{student.totalModulesAcrossAll} মডিউল
                    </div>
                    <div style={{ width: '160px' }}>
                      <ProgressBar value={student.completedModulesAcrossAll} total={student.totalModulesAcrossAll} color={meta.color} />
                    </div>
                    <button onClick={() => toggleExpand(student.userId)}
                      className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem', gap: '3px' }}>
                      {isExpanded ? <><ChevronDown size={14} /> সংকুচিত করুন</> : <><ChevronRight size={14} /> বিস্তারিত দেখুন</>}
                    </button>
                  </div>
                </div>

                {/* Expanded detail — per course + subjects */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--color-earth-1)', padding: '1rem 1.25rem', background: 'var(--color-surface-alt)' }}>
                    {student.courses.length === 0 ? (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>এই ব্যাচে কোনো কোর্স নেই।</p>
                    ) : student.courses.map(course => (
                      <div key={course.courseId} style={{ marginBottom: '1.25rem' }}>
                        {/* Course header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <BookOpen size={16} color="var(--color-primary)" />
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{course.title}</span>
                          {!course.enrolled && (
                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '20px', background: '#fef9c3', color: '#854d0e', fontWeight: 600 }}>⚠ এনরোল হননি</span>
                          )}
                          {course.vivaScore && (
                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '20px', background: '#ede9fe', color: '#6d28d9', fontWeight: 600 }}>
                              <Award size={10} style={{ display: 'inline', marginRight: '2px' }} />ভাইভা: {course.vivaScore.marks}
                            </span>
                          )}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <ProgressBar value={course.completedModules} total={course.totalModules} color="var(--color-primary)" />
                        </div>
                        {/* Subject rows */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1rem', borderLeft: '2px solid var(--color-earth-1)' }}>
                          {course.subjects.map(subject => (
                            <div key={subject.subjectId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'var(--color-bg)' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 600, minWidth: '120px' }}>{subject.title}</span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                {subject.completedModules}/{subject.totalModules} মডিউল
                              </span>
                              <div style={{ flex: 1, minWidth: '100px' }}>
                                <ProgressBar
                                  value={subject.completedModules}
                                  total={subject.totalModules}
                                  color={subject.completedModules === subject.totalModules ? '#16a34a' : 'var(--color-primary)'}
                                />
                              </div>
                              <ExamBadge exam={subject.finalExam} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
