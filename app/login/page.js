'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'ইমেইল দিন';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'সঠিক ইমেইল দিন';
    if (!form.password) errs.password = 'পাসওয়ার্ড দিন';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setServerError('ইমেইল বা পাসওয়ার্ড ভুল। আবার চেষ্টা করুন।');
        } else if (res.status === 403) {
          setServerError('আপনার অ্যাকাউন্টটি এখনো অনুমোদিত হয়নি। অ্যাডমিন অনুমোদনের পর লগইন করতে পারবেন।');
        } else {
          setServerError(data.error || 'সার্ভারে সমস্যা হয়েছে। পরে চেষ্টা করুন।');
        }
        return;
      }

      // Redirect ADMIN to admin dashboard, others to user dashboard
      if (data.user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch {
      setServerError('নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ যাচাই করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
  };

  return (
    <main className={styles.page}>
      <div className={styles.patternBg} aria-hidden="true" />

      <div className={styles.container}>
        <Link href="/" className={styles.backLink} id="login-back-link">
          ← ফিরে যান
        </Link>

        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>📖</div>
          <h1 className={styles.logoTitle}>IQC Academy</h1>
          <p className={styles.logoSub}>আবার স্বাগতম!</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>লগইন করুন</h2>
            <p className={styles.cardSub}>আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div style={{ background: 'var(--color-error-bg, #fef2f2)', border: '1px solid var(--color-error)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1rem', color: 'var(--color-error)', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">ইমেইল ঠিকানা <span style={{ color: 'var(--color-error)' }}>*</span></label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${errors.email ? 'error' : form.email ? 'success' : ''}`}
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
                inputMode="email"
              />
              {errors.email && <span className="form-error"><AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">পাসওয়ার্ড <span style={{ color: 'var(--color-error)' }}>*</span></label>
              <div className={styles.passwordWrapper}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="আপনার পাসওয়ার্ড"
                  value={form.password}
                  onChange={handleChange('password')}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass(p => !p)}
                  aria-label="পাসওয়ার্ড দেখুন"
                  id="login-toggle-pass"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error"><AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />{errors.password}</span>}
            </div>

            {/* Forgot */}
            <div className={styles.forgotRow}>
              <Link href="/forgot-password" className={styles.forgotLink} id="login-forgot-link">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              className={`btn btn-primary w-full ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner spinner-sm" /> লগইন হচ্ছে...</>
              ) : (
                'লগইন করুন'
              )}
            </button>
          </form>

          <div className="divider-ornament">অথবা</div>

          <p className={styles.registerLink}>
            নতুন ব্যবহারকারী?{' '}
            <Link href="/register" id="login-register-link" className={styles.registerLinkAnchor}>
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>

        <p className={styles.footerNote}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </p>
      </div>
    </main>
  );
}
