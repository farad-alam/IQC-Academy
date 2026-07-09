'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import styles from '../login/login.module.css';
import Loader from '@/components/ui/Loader';

const DRAFT_KEY = 'iqc_reg_draft';

const DIVISIONS = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'সিলেট', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];

const currentYear = new Date().getFullYear();

// ─── Client-side validation matching backend Zod schema ─────────────────────
function validateStep1(form) {
  const errs = {};
  if (!form.name.trim()) {
    errs.name = 'নাম আবশ্যক';
  } else if (form.name.trim().length < 2) {
    errs.name = 'নাম কমপক্ষে ২ অক্ষরের হতে হবে';
  } else if (!/^[\u0980-\u09FFa-zA-Z\s.'"-]+$/.test(form.name)) {
    errs.name = 'নাম শুধুমাত্র বাংলা বা ইংরেজি অক্ষরে হবে';
  }

  if (!form.mobile) {
    errs.mobile = 'মোবাইল নম্বর আবশ্যক';
  } else if (!/^01[3-9]\d{8}$/.test(form.mobile)) {
    errs.mobile = 'সঠিক ১১-ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)';
  }

  if (!form.email) {
    errs.email = 'ইমেইল আবশ্যক';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = 'সঠিক ইমেইল ঠিকানা দিন';
  }

  if (!form.dob) {
    errs.dob = 'জন্মতারিখ আবশ্যক';
  } else {
    const d = new Date(form.dob);
    const now = new Date();
    const age = now.getFullYear() - d.getFullYear();
    if (d >= now) errs.dob = 'জন্মতারিখ অতীতের হতে হবে';
    else if (age < 8 || age > 100) errs.dob = 'বয়স ৮ থেকে ১০০ বছরের মধ্যে হতে হবে';
  }

  if (form.facebook && form.facebook.trim()) {
    try { new URL(form.facebook); }
    catch { errs.facebook = 'সঠিক ফেসবুক ইউআরএল দিন (https://... দিয়ে শুরু হবে)'; }
  }

  return errs;
}

function validateStep2(form) {
  const errs = {};
  if (!form.institution.trim()) errs.institution = 'প্রতিষ্ঠানের নাম আবশ্যক';
  if (!form.division) errs.division = 'বিভাগ নির্বাচন করুন';
  if (!form.district.trim()) errs.district = 'জেলার নাম আবশ্যক';

  if (!form.sscYear) {
    errs.sscYear = 'এসএসসি পাশের সাল আবশ্যক';
  } else if (!/^\d{4}$/.test(form.sscYear)) {
    errs.sscYear = 'পাশের সাল ৪ ডিজিটের হতে হবে';
  } else {
    const yr = parseInt(form.sscYear, 10);
    if (yr < 1990 || yr > currentYear + 1) errs.sscYear = `সাল ১৯৯০ থেকে ${currentYear + 1} এর মধ্যে হতে হবে`;
  }

  if (form.sscBoard && form.sscBoard.trim()) {
    if (!/^[\u0980-\u09FFa-zA-Z\s]+$/.test(form.sscBoard)) {
      errs.sscBoard = 'বোর্ডের নাম শুধু অক্ষরে হবে (যেমন: Dhaka, Rajshahi)';
    }
  }

  if (form.sscGpa && form.sscGpa.trim()) {
    if (!/^\d+(\.\d{1,2})?$/.test(form.sscGpa)) {
      errs.sscGpa = 'জিপিএ শুধু সংখ্যায় হবে (যেমন: 5.00 বা 4.26)';
    } else {
      const g = parseFloat(form.sscGpa);
      if (isNaN(g) || g < 0 || g > 5) errs.sscGpa = 'জিপিএ ০.০০ থেকে ৫.০০ এর মধ্যে হতে হবে';
    }
  }

  return errs;
}

function validateStep3(form) {
  const errs = {};
  if (!form.whatsapp) {
    errs.whatsapp = 'WhatsApp নম্বর আবশ্যক';
  } else if (!/^01[3-9]\d{8}$/.test(form.whatsapp)) {
    errs.whatsapp = 'সঠিক ১১-ডিজিটের WhatsApp নম্বর দিন';
  }

  if (!form.password) {
    errs.password = 'পাসওয়ার্ড আবশ্যক';
  } else if (form.password.length < 8) {
    errs.password = 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে';
  } else if (!/[A-Z]/.test(form.password)) {
    errs.password = 'পাসওয়ার্ডে কমপক্ষে একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে';
  } else if (!/[0-9]/.test(form.password)) {
    errs.password = 'পাসওয়ার্ডে কমপক্ষে একটি সংখ্যা (0-9) থাকতে হবে';
  }

  if (form.password !== form.confirmPassword) errs.confirmPassword = 'পাসওয়ার্ড মিলছে না';

  return errs;
}

// ─── Password strength ───────────────────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'দুর্বল', color: '#ef4444' };
  if (score <= 2) return { score, label: 'মধ্যম', color: '#f59e0b' };
  if (score <= 3) return { score, label: 'ভালো', color: '#3b82f6' };
  return { score, label: 'শক্তিশালী', color: '#22c55e' };
}

// ─── Small helper components ─────────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return <span className="form-error"><AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />{msg}</span>;
}

function Req() { return <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>; }

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', mobile: '', email: '', facebook: '',
    institution: '', division: '', district: '', upazila: '',
    dob: '', sscYear: '', sscBoard: '', sscGpa: '',
    whatsapp: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Restore draft from localStorage ────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        setForm(prev => ({ ...prev, ...draft, password: '', confirmPassword: '' }));
      }
    } catch { /* ignore */ }
  }, []);

  // ── Save draft on every change (exclude password fields) ──────────────────
  const saveDraft = useCallback((newForm) => {
    try {
      const { password, confirmPassword, ...rest } = newForm;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch { /* ignore */ }
  }, []);

  const handleChange = (field) => (e) => {
    const newForm = { ...form, [field]: e.target.value };
    setForm(newForm);
    saveDraft(newForm);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
  };

  const handleNext = () => {
    const errs = step === 1 ? validateStep1(form) : validateStep2(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => { setErrors({}); setServerError(''); setStep(s => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep3(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');

    try {
      const { confirmPassword, ...payload } = form;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.details) {
          // Map Zod field errors
          const fieldErrs = {};
          Object.entries(data.details).forEach(([key, val]) => {
            if (val?._errors?.[0]) fieldErrs[key] = val._errors[0];
          });
          if (Object.keys(fieldErrs).length > 0) {
            setErrors(fieldErrs);
          } else {
            setServerError(data.error || 'কোনো সমস্যা হয়েছে।');
          }
        } else if (res.status === 409) {
          setServerError('এই ইমেইল বা মোবাইল নম্বর দিয়ে আগেই অ্যাকাউন্ট আছে। লগইন করুন।');
        } else {
          setServerError(data.error || 'সার্ভারে সমস্যা হয়েছে। পরে চেষ্টা করুন।');
        }
        return;
      }

      // Success — clear draft and redirect
      localStorage.removeItem(DRAFT_KEY);
      router.push('/register/success');
    } catch {
      setServerError('নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ যাচাই করুন।');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <main className={styles.page}>
      <div className={styles.patternBg} aria-hidden="true" />

      <div className={styles.container} style={{ maxWidth: '600px' }}>
        <Link href="/" className={styles.backLink}>← ফিরে যান</Link>

        <div className={styles.logoArea} style={{ marginBottom: '1.5rem' }}>
          <h1 className={styles.logoTitle} style={{ fontSize: '1.75rem' }}>নতুন অ্যাকাউন্ট তৈরি করুন</h1>
          <p className={styles.logoSub}>IQC Academy-তে আপনাকে স্বাগতম</p>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${(step / 3) * 100}%`, transition: 'width 0.3s ease' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span style={{ color: step >= 1 ? 'var(--color-primary)' : '', fontWeight: step === 1 ? 700 : 400 }}>
              {step === 1 ? '→ ' : step > 1 ? '✓ ' : ''}ব্যক্তিগত তথ্য
            </span>
            <span style={{ color: step >= 2 ? 'var(--color-primary)' : '', fontWeight: step === 2 ? 700 : 400 }}>
              {step === 2 ? '→ ' : step > 2 ? '✓ ' : ''}শিক্ষা ও ঠিকানা
            </span>
            <span style={{ color: step >= 3 ? 'var(--color-primary)' : '', fontWeight: step === 3 ? 700 : 400 }}>
              {step === 3 ? '→ ' : ''}নিরাপত্তা
            </span>
          </div>
        </div>

        {/* Server Error Banner */}
        {serverError && (
          <div style={{ background: 'var(--color-error-bg, #fef2f2)', border: '1px solid var(--color-error)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', color: 'var(--color-error)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <XCircle size={18} /> {serverError}
            {serverError.includes('আগেই অ্যাকাউন্ট') && (
              <Link href="/login" style={{ marginLeft: 'auto', color: 'var(--color-primary)', fontWeight: 700 }}>লগইন করুন</Link>
            )}
          </div>
        )}

        <div className={styles.card}>
          <form className={styles.form} noValidate onSubmit={handleSubmit}>

            {/* ── STEP 1: Personal Info ──────────────────────────────────── */}
            {step === 1 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">পুরো নাম (বাংলায় বা ইংরেজিতে)<Req /></label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : form.name ? 'success' : ''}`}
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="আপনার নাম লিখুন"
                    autoComplete="name"
                    autoFocus
                  />
                  <FieldError msg={errors.name} />
                </div>

                <div className="grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">মোবাইল নম্বর<Req /></label>
                    <input
                      type="tel"
                      className={`form-input ${errors.mobile ? 'error' : form.mobile ? 'success' : ''}`}
                      value={form.mobile}
                      onChange={handleChange('mobile')}
                      placeholder="01XXXXXXXXX"
                      autoComplete="tel"
                      maxLength={11}
                      inputMode="numeric"
                    />
                    <FieldError msg={errors.mobile} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">জন্মতারিখ<Req /></label>
                    <input
                      type="date"
                      className={`form-input ${errors.dob ? 'error' : form.dob ? 'success' : ''}`}
                      value={form.dob}
                      onChange={handleChange('dob')}
                      autoComplete="bday"
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 8)).toISOString().split('T')[0]}
                    />
                    <FieldError msg={errors.dob} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ইমেইল ঠিকানা<Req /></label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : form.email ? 'success' : ''}`}
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="example@email.com"
                    autoComplete="email"
                    inputMode="email"
                  />
                  <FieldError msg={errors.email} />
                </div>

                <div className="form-group">
                  <label className="form-label">ফেসবুক প্রোফাইল লিংক <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(ঐচ্ছিক)</span></label>
                  <input
                    type="url"
                    className={`form-input ${errors.facebook ? 'error' : ''}`}
                    value={form.facebook}
                    onChange={handleChange('facebook')}
                    placeholder="https://facebook.com/yourprofile"
                    autoComplete="url"
                  />
                  <FieldError msg={errors.facebook} />
                </div>
              </div>
            )}

            {/* ── STEP 2: Education & Address ────────────────────────────── */}
            {step === 2 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">বর্তমান প্রতিষ্ঠানের নাম<Req /></label>
                  <input
                    type="text"
                    className={`form-input ${errors.institution ? 'error' : form.institution ? 'success' : ''}`}
                    value={form.institution}
                    onChange={handleChange('institution')}
                    placeholder="স্কুল / কলেজ / বিশ্ববিদ্যালয়"
                    autoComplete="organization"
                  />
                  <FieldError msg={errors.institution} />
                </div>

                <div className="grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">বিভাগ<Req /></label>
                    <select
                      className={`form-input form-select ${errors.division ? 'error' : form.division ? 'success' : ''}`}
                      value={form.division}
                      onChange={handleChange('division')}
                      autoComplete="address-level1"
                    >
                      <option value="">নির্বাচন করুন</option>
                      {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <FieldError msg={errors.division} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">জেলা<Req /></label>
                    <input
                      type="text"
                      className={`form-input ${errors.district ? 'error' : form.district ? 'success' : ''}`}
                      value={form.district}
                      onChange={handleChange('district')}
                      placeholder="আপনার জেলা"
                      autoComplete="address-level2"
                    />
                    <FieldError msg={errors.district} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">উপজেলা <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(ঐচ্ছিক)</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.upazila}
                    onChange={handleChange('upazila')}
                    placeholder="আপনার উপজেলা"
                    autoComplete="address-level3"
                  />
                </div>

                <div className="divider" style={{ margin: '0.5rem 0' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  📜 এসএসসি বা সমমান পরীক্ষার তথ্য
                </p>

                <div className="grid-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">পাশের সাল<Req /></label>
                    <input
                      type="text"
                      className={`form-input ${errors.sscYear ? 'error' : form.sscYear ? 'success' : ''}`}
                      value={form.sscYear}
                      onChange={handleChange('sscYear')}
                      placeholder="যেমন: 2020"
                      maxLength={4}
                      inputMode="numeric"
                    />
                    <FieldError msg={errors.sscYear} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">বোর্ড</label>
                    <input
                      type="text"
                      className={`form-input ${errors.sscBoard ? 'error' : ''}`}
                      value={form.sscBoard}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^[\u0980-\u09FFa-zA-Z\s]+$/.test(val)) {
                          handleChange('sscBoard')(e);
                        }
                      }}
                      placeholder="যেমন: ঢাকা"
                    />
                    <FieldError msg={errors.sscBoard} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">জিপিএ</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      className={`form-input ${errors.sscGpa ? 'error' : ''}`}
                      value={form.sscGpa}
                      onChange={handleChange('sscGpa')}
                      placeholder="যেমন: 4.50"
                      inputMode="decimal"
                    />
                    <FieldError msg={errors.sscGpa} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Security ──────────────────────────────────────── */}
            {step === 3 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">WhatsApp নম্বর<Req /></label>
                  <input
                    type="tel"
                    className={`form-input ${errors.whatsapp ? 'error' : form.whatsapp ? 'success' : ''}`}
                    value={form.whatsapp}
                    onChange={handleChange('whatsapp')}
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                    maxLength={11}
                    inputMode="numeric"
                  />
                  <span className="form-hint">ক্লাসের লিংক ও গুরুত্বপূর্ণ নোটিফিকেশন এই নম্বরে পাঠানো হবে।</span>
                  <FieldError msg={errors.whatsapp} />
                </div>

                <div className="form-group">
                  <label className="form-label">পাসওয়ার্ড<Req /></label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      value={form.password}
                      onChange={handleChange('password')}
                      placeholder="কমপক্ষে ৮ অক্ষর, একটি বড় হাতের অক্ষর ও সংখ্যা"
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)} aria-label="পাসওয়ার্ড দেখুন">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Password strength meter */}
                  {form.password && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ height: '4px', background: 'var(--color-earth-2)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(strength.score / 5) * 100}%`,
                          background: strength.color,
                          transition: 'width 0.3s ease, background 0.3s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
                        পাসওয়ার্ড শক্তি: {strength.label}
                      </span>
                    </div>
                  )}
                  {/* Requirement hints */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                    {[
                      { ok: form.password.length >= 8, text: 'কমপক্ষে ৮ অক্ষর' },
                      { ok: /[A-Z]/.test(form.password), text: 'একটি বড় হাতের অক্ষর (A-Z)' },
                      { ok: /[0-9]/.test(form.password), text: 'একটি সংখ্যা (0-9)' },
                    ].map(r => (
                      <span key={r.text} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: r.ok ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                        {r.ok ? <CheckCircle size={12} /> : <XCircle size={12} />} {r.text}
                      </span>
                    ))}
                  </div>
                  <FieldError msg={errors.password} />
                </div>

                <div className="form-group">
                  <label className="form-label">পাসওয়ার্ড নিশ্চিত করুন<Req /></label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className={`form-input ${errors.confirmPassword ? 'error' : form.confirmPassword && form.confirmPassword === form.password ? 'success' : ''}`}
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      placeholder="পুনরায় পাসওয়ার্ডটি লিখুন"
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(p => !p)} aria-label="নিশ্চিত পাসওয়ার্ড দেখুন">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.confirmPassword && form.confirmPassword === form.password && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                      <CheckCircle size={12} /> পাসওয়ার্ড মিলেছে
                    </span>
                  )}
                  <FieldError msg={errors.confirmPassword} />
                </div>
              </div>
            )}

            {/* ── Navigation Buttons ─────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              {step > 1 && (
                <button type="button" onClick={handlePrev} className="btn btn-outline" style={{ flex: 1 }} disabled={loading}>
                  ← পেছনে
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="btn btn-primary" style={{ flex: step === 1 ? 1 : 2 }}>
                  পরবর্তী ধাপ →
                </button>
              ) : (
                <button type="submit" className="btn btn-accent" style={{ flex: 2 }} disabled={loading}>
                  {loading
                    ? <Loader variant="button" text="সাবমিট হচ্ছে..." />
                    : 'রেজিস্ট্রেশন সম্পন্ন করুন ✨'
                  }
                </button>
              )}
            </div>
          </form>

          <div className="divider-ornament">অথবা</div>

          <p className={styles.registerLink}>
            ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className={styles.registerLinkAnchor}>লগইন করুন</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
