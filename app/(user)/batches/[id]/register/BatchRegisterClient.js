'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Users, CheckCircle, Loader2, ChevronLeft } from 'lucide-react';

// Reuse the registration form fields — same as regular registration
const DIVISIONS = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];
const SSC_BOARDS = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'যশোর', 'কুমিল্লা', 'বরিশাল', 'সিলেট', 'দিনাজপুর', 'মাদ্রাসা', 'কারিগরি'];

export default function BatchRegisterClient({ batchId }) {
  const router = useRouter();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    name: '', email: '', mobile: '', password: '', confirmPassword: '',
    whatsapp: '', institution: '', division: '', district: '', upazila: '',
    dob: '', sscYear: '', sscBoard: '', sscGpa: ''
  });

  useEffect(() => {
    fetch(`/api/batches/${batchId}`).then(r => r.json()).then(data => {
      if (data.error) setError(data.error === 'Batch not found' ? 'ব্যাচটি পাওয়া যায়নি।' : 'এই ব্যাচে বর্তমানে ভর্তি চলছে না।');
      else if (data.status !== 'ENROLLING') setError('এই ব্যাচে বর্তমানে ভর্তি চলছে না।');
      else setBatch(data);
      setLoading(false);
    });
  }, [batchId]);

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    if (form.password !== form.confirmPassword) { setFieldErrors({ confirmPassword: ['পাসওয়ার্ড মিলছে না।'] }); return; }
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/auth/batch-register/${batchId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, mobile: form.mobile, password: form.password, whatsapp: form.whatsapp || undefined, institution: form.institution || undefined, division: form.division || undefined, district: form.district || undefined, upazila: form.upazila || undefined, dob: form.dob || undefined, sscYear: form.sscYear || undefined, sscBoard: form.sscBoard || undefined, sscGpa: form.sscGpa || undefined })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        if (data.details) {
          // Flatten Zod errors { field: { _errors: ['err'] } } to { field: ['err'] }
          const fErrors = {};
          for (const key in data.details) {
            if (key !== '_errors' && data.details[key]._errors) {
              fErrors[key] = data.details[key]._errors;
            }
          }
          setFieldErrors(fErrors);
          setError('দয়া করে ফর্মের ত্রুটিগুলো ঠিক করুন।');
        } else {
          setError(data.error || 'নিবন্ধনে সমস্যা হয়েছে।');
        }
      }
    } catch (err) {
      setError('নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন।');
    } finally { setSubmitting(false); }
  };

  if (loading) return <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></main>;

  if (error && !batch) return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
      <div style={{ fontSize: '3rem' }}>🔒</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>{error}</h2>
      <Link href="/batches" className="btn btn-primary">সকল ব্যাচ দেখুন</Link>
    </main>
  );

  if (success) return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
        <CheckCircle size={44} color="#16a34a" />
      </div>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>নিবন্ধন সফল!</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '500px' }}>
          আপনি সফলভাবে <strong>{batch?.name}</strong> ব্যাচে নিবন্ধিত হয়েছেন। এখন লগইন করুন।
        </p>
      </div>
      <Link href="/login" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>লগইন করুন</Link>
    </main>
  );

  return (
    <main style={{ padding: '2rem 1.5rem', maxWidth: '700px', margin: '0 auto' }}>
      <Link href="/batches" className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '1.5rem' }}>
        <ChevronLeft size={16} /> সকল ব্যাচ
      </Link>

      {/* Batch info card */}
      {batch && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderTop: '4px solid var(--color-primary)', background: 'var(--color-primary-50)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{batch.name}-এ ভর্তি হচ্ছেন</h1>
          {batch.description && <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>{batch.description}</p>}
          {batch.courses?.length > 0 && (
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>এই ব্যাচে যে কোর্সগুলো থাকবে:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {batch.courses.map(bc => (
                  <span key={bc.courseId} style={{ padding: '0.3rem 0.75rem', background: 'white', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500, border: '1px solid var(--color-earth-1)' }}>
                    <BookOpen size={12} style={{ display: 'inline', marginRight: '4px' }} />{bc.course.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>নিবন্ধন ফর্ম</h2>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.875rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-2 gap-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">পূর্ণ নাম *</label>
              <input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="আপনার পূর্ণ নাম" style={{ borderColor: fieldErrors.name ? 'var(--color-error)' : '' }} />
              {fieldErrors.name && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.name[0]}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">ইমেইল *</label>
              <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" style={{ borderColor: fieldErrors.email ? 'var(--color-error)' : '' }} />
              {fieldErrors.email && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.email[0]}</div>}
            </div>
          </div>
          <div className="grid-2 gap-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">মোবাইল নম্বর *</label>
              <input className="form-input" required value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="01XXXXXXXXX" style={{ borderColor: fieldErrors.mobile ? 'var(--color-error)' : '' }} />
              {fieldErrors.mobile && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.mobile[0]}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">হোয়াটসঅ্যাপ *</label>
              <input className="form-input" required value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="01XXXXXXXXX" style={{ borderColor: fieldErrors.whatsapp ? 'var(--color-error)' : '' }} />
              {fieldErrors.whatsapp && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.whatsapp[0]}</div>}
            </div>
          </div>
          <div className="grid-2 gap-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">পাসওয়ার্ড *</label>
              <input className="form-input" type="password" required value={form.password} onChange={e => set('password', e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" style={{ borderColor: fieldErrors.password ? 'var(--color-error)' : '' }} />
              {fieldErrors.password && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.password[0]}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">পাসওয়ার্ড নিশ্চিত *</label>
              <input className="form-input" type="password" required value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="পাসওয়ার্ড পুনরায় লিখুন" style={{ borderColor: fieldErrors.confirmPassword ? 'var(--color-error)' : '' }} />
              {fieldErrors.confirmPassword && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.confirmPassword[0]}</div>}
            </div>
          </div>
          <div className="grid-2 gap-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">শিক্ষাপ্রতিষ্ঠান *</label>
              <input className="form-input" required value={form.institution} onChange={e => set('institution', e.target.value)} placeholder="স্কুল/কলেজ/মাদ্রাসার নাম" style={{ borderColor: fieldErrors.institution ? 'var(--color-error)' : '' }} />
              {fieldErrors.institution && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.institution[0]}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">বিভাগ *</label>
              <select className="form-input form-select" required value={form.division} onChange={e => set('division', e.target.value)} style={{ borderColor: fieldErrors.division ? 'var(--color-error)' : '' }}>
                <option value="">বিভাগ নির্বাচন</option>
                {DIVISIONS.map(d => <option key={d}>{d}</option>)}
              </select>
              {fieldErrors.division && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.division[0]}</div>}
            </div>
          </div>
          <div className="grid-2 gap-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">জেলা *</label>
              <input className="form-input" required value={form.district} onChange={e => set('district', e.target.value)} placeholder="জেলার নাম" style={{ borderColor: fieldErrors.district ? 'var(--color-error)' : '' }} />
              {fieldErrors.district && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.district[0]}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">উপজেলা</label>
              <input className="form-input" value={form.upazila} onChange={e => set('upazila', e.target.value)} placeholder="উপজেলার নাম" style={{ borderColor: fieldErrors.upazila ? 'var(--color-error)' : '' }} />
              {fieldErrors.upazila && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.upazila[0]}</div>}
            </div>
          </div>
          <div className="grid-2 gap-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">জন্ম তারিখ *</label>
              <input className="form-input" type="date" required value={form.dob} onChange={e => set('dob', e.target.value)} style={{ borderColor: fieldErrors.dob ? 'var(--color-error)' : '' }} />
              {fieldErrors.dob && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.dob[0]}</div>}
            </div>
          </div>
          <div className="grid-3 gap-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">SSC সাল *</label>
              <input className="form-input" required value={form.sscYear} onChange={e => set('sscYear', e.target.value)} placeholder="যেমন: ২০২৩" style={{ borderColor: fieldErrors.sscYear ? 'var(--color-error)' : '' }} />
              {fieldErrors.sscYear && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.sscYear[0]}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">SSC বোর্ড</label>
              <select className="form-input form-select" value={form.sscBoard} onChange={e => set('sscBoard', e.target.value)} style={{ borderColor: fieldErrors.sscBoard ? 'var(--color-error)' : '' }}>
                <option value="">বোর্ড নির্বাচন</option>
                {SSC_BOARDS.map(b => <option key={b}>{b}</option>)}
              </select>
              {fieldErrors.sscBoard && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.sscBoard[0]}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">SSC GPA</label>
              <input className="form-input" value={form.sscGpa} onChange={e => set('sscGpa', e.target.value)} placeholder="যেমন: ৫.০০" style={{ borderColor: fieldErrors.sscGpa ? 'var(--color-error)' : '' }} />
              {fieldErrors.sscGpa && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{fieldErrors.sscGpa[0]}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ padding: '0.875rem', fontSize: '1.05rem', fontWeight: 700, marginTop: '0.5rem' }}>
            {submitting ? <><Loader2 size={20} className="spin" /> নিবন্ধন হচ্ছে...</> : 'নিবন্ধন সম্পন্ন করুন'}
          </button>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            ইতিমধ্যে একাউন্ট আছে? <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>লগইন করুন</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
