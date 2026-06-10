'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'ইমেইল দিন';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'সঠিক ইমেইল দিন';
    if (!form.password) errs.password = 'পাসওয়ার্ড দিন';
    else if (form.password.length < 6) errs.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    // Redirect to home (mock)
    window.location.href = '/';
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <main className={styles.page}>
      <div className={styles.patternBg} aria-hidden="true" />

      <div className={styles.container}>
        {/* Back */}
        <Link href="/" className={styles.backLink} id="login-back-link">
          ← ফিরে যান
        </Link>

        {/* Logo */}
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>📖</div>
          <h1 className={styles.logoTitle}>IQC Academy</h1>
          <p className={styles.logoSub}>আবার স্বাগতম!</p>
        </div>

        {/* Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>লগইন করুন</h2>
            <p className={styles.cardSub}>আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label required">ইমেইল ঠিকানা</label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${errors.email ? 'error' : form.email ? 'success' : ''}`}
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password" className="form-label required">পাসওয়ার্ড</label>
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
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
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

        {/* Islamic footer note */}
        <p className={styles.footerNote}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </p>
      </div>
    </main>
  );
}
