'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';
import styles from '../login/login.module.css';
import Loader from '@/components/ui/Loader';

// ── Password strength ──────────────────────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'দুর্বল', color: '#ef4444' };
  if (score <= 2) return { score, label: 'মধ্যম', color: '#f59e0b' };
  if (score <= 3) return { score, label: 'ভালো', color: '#3b82f6' };
  return { score, label: 'শক্তিশালী', color: '#22c55e' };
}

// ── Mask email for display ────────────────────────────────────────────────────
function maskEmail(email) {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.length <= 2 ? local[0] : local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(3, local.length - 2))}@${domain}`;
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP + new password
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Resend countdown
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef(null);

  const startCooldown = useCallback(() => {
    setResendCooldown(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  // OTP input refs for auto-advance
  const otpRefs = useRef([]);

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setEmailError('');
    setServerError('');

    if (!email) { setEmailError('ইমেইল ঠিকানা দিন'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('সঠিক ইমেইল ঠিকানা দিন'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setServerError('অনেক বেশি চেষ্টা হয়েছে। ১৫ মিনিট পরে আবার চেষ্টা করুন।');
        } else {
          setServerError(data.error || 'সার্ভারে সমস্যা হয়েছে। পরে চেষ্টা করুন।');
        }
        return;
      }

      // Move to step 2 and start resend cooldown
      setStep(2);
      startCooldown();
    } catch {
      setServerError('নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ যাচাই করুন।');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ─────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    // Allow only digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setErrors(prev => ({ ...prev, otp: '' }));

    // Auto-advance
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split('').forEach((ch, i) => { if (i < 6) newOtp[i] = ch; });
    setOtp(newOtp);
    // Focus last filled or next empty
    const nextEmpty = newOtp.findIndex(d => !d);
    const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
    otpRefs.current[focusIdx]?.focus();
  };

  // ── Step 2: Reset password ─────────────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    const errs = {};
    const otpCode = otp.join('');

    if (otpCode.length < 6) errs.otp = '৬-ডিজিটের কোডটি সম্পূর্ণ করুন';
    if (!newPassword) errs.newPassword = 'নতুন পাসওয়ার্ড দিন';
    else if (newPassword.length < 6) errs.newPassword = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'পাসওয়ার্ড মিলছে না';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setServerError('অনেক বেশি চেষ্টা হয়েছে। ১৫ মিনিট পরে আবার চেষ্টা করুন।');
        } else if (res.status === 400) {
          // Invalid or expired OTP
          setErrors({ otp: 'কোডটি ভুল বা মেয়াদ শেষ হয়ে গেছে। পুনরায় পাঠান।' });
        } else {
          setServerError(data.error || 'সার্ভারে সমস্যা হয়েছে। পরে চেষ্টা করুন।');
        }
        return;
      }

      // Success — redirect to login with success flag
      router.push('/login?reset=success');
    } catch {
      setServerError('নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ যাচাই করুন।');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(newPassword);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <main className={styles.page}>
      <div className={styles.patternBg} aria-hidden="true" />

      <div className={styles.container}>
        {/* Back link */}
        <Link href="/login" className={styles.backLink} id="forgot-back-link">
          <ArrowLeft size={16} /> লগইন পেজে ফিরুন
        </Link>

        {/* Logo */}
        <div className={styles.logoArea} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/images/iqc-academy-green-logo.png" alt="IQC Academy Logo" style={{ height: '64px', width: 'auto' }} />
          <p className={styles.logoSub}>পাসওয়ার্ড রিসেট করুন</p>
        </div>

        {/* ── STEP INDICATOR ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {/* Step 1 bubble */}
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            background: step >= 1 ? 'var(--color-primary)' : 'var(--color-earth-1)',
            color: step >= 1 ? 'white' : 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.3s ease',
            flexShrink: 0,
          }}>
            {step > 1 ? <CheckCircle size={16} /> : '১'}
          </div>
          <div style={{ flex: 1, height: '2px', background: step > 1 ? 'var(--color-primary)' : 'var(--color-earth-1)', transition: 'background 0.3s ease' }} />
          {/* Step 2 bubble */}
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            background: step === 2 ? 'var(--color-primary)' : 'var(--color-earth-1)',
            color: step === 2 ? 'white' : 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.3s ease',
            flexShrink: 0,
          }}>২</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', marginTop: '-1rem' }}>
          <span style={{ color: 'var(--color-primary)', fontWeight: step === 1 ? 700 : 400 }}>ইমেইল যাচাই</span>
          <span style={{ color: step === 2 ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: step === 2 ? 700 : 400 }}>নতুন পাসওয়ার্ড</span>
        </div>

        {/* ── CARD ─────────────────────────────────────────────────────────── */}
        <div className={styles.card}>

          {/* Server error banner */}
          {serverError && (
            <div style={{ background: 'var(--color-error-bg)', border: '1px solid var(--color-error)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1rem', color: 'var(--color-error)', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <XCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{serverError}</span>
            </div>
          )}

          {/* ══════════════════ STEP 1 ══════════════════ */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>ইমেইল যাচাই করুন</h2>
                <p className={styles.cardSub}>আপনার নিবন্ধিত ইমেইলে একটি ৬-ডিজিটের কোড পাঠানো হবে</p>
              </div>

              <form onSubmit={handleSendOtp} className={styles.form} noValidate>
                <div className="form-group">
                  <label htmlFor="forgot-email" className="form-label">
                    ইমেইল ঠিকানা <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                    <input
                      id="forgot-email"
                      type="email"
                      className={`form-input ${emailError ? 'error' : email ? 'success' : ''}`}
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="example@email.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailError(''); setServerError(''); }}
                      autoComplete="email"
                      inputMode="email"
                      autoFocus
                    />
                  </div>
                  {emailError && (
                    <span className="form-error">
                      <AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />{emailError}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  id="forgot-send-otp-btn"
                  className="btn btn-primary w-full"
                  style={{ marginTop: '0.5rem' }}
                  disabled={loading}
                >
                  {loading
                    ? <Loader variant="button" text="পাঠানো হচ্ছে..." />
                    : 'OTP কোড পাঠান →'
                  }
                </button>
              </form>
            </div>
          )}

          {/* ══════════════════ STEP 2 ══════════════════ */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>নতুন পাসওয়ার্ড সেট করুন</h2>
                <p className={styles.cardSub}>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{maskEmail(email)}</span>
                  {' '}এ পাঠানো কোডটি দিন
                </p>
              </div>

              <form onSubmit={handleReset} className={styles.form} noValidate>

                {/* ── OTP boxes ── */}
                <div className="form-group">
                  <label className="form-label">
                    যাচাই কোড <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }} onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        id={`otp-digit-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`form-input ${errors.otp ? 'error' : ''}`}
                        style={{
                          width: '3rem', height: '3.5rem', textAlign: 'center',
                          fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-latin)',
                          padding: '0', letterSpacing: '0',
                        }}
                        autoComplete="one-time-code"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                  {errors.otp && (
                    <span className="form-error" style={{ justifyContent: 'center' }}>
                      <AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />{errors.otp}
                    </span>
                  )}

                  {/* Resend row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    কোড পাননি?{' '}
                    {resendCooldown > 0 ? (
                      <span style={{ color: 'var(--color-text-light)' }}>{resendCooldown}s পরে পুনরায় পাঠান</span>
                    ) : (
                      <button
                        type="button"
                        id="forgot-resend-btn"
                        onClick={handleSendOtp}
                        disabled={loading}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                      >
                        পুনরায় পাঠান
                      </button>
                    )}
                  </div>
                </div>

                {/* ── New password ── */}
                <div className="form-group">
                  <label className="form-label">
                    নতুন পাসওয়ার্ড <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="forgot-new-password"
                      type={showPass ? 'text' : 'password'}
                      className={`form-input ${errors.newPassword ? 'error' : ''}`}
                      placeholder="নতুন পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর)"
                      value={newPassword}
                      onChange={e => { setNewPassword(e.target.value); setErrors(prev => ({ ...prev, newPassword: '' })); }}
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)} aria-label="পাসওয়ার্ড দেখুন">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {newPassword && (
                    <div style={{ marginTop: '0.4rem' }}>
                      <div style={{ height: '4px', background: 'var(--color-earth-2)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(strength.score / 5) * 100}%`, background: strength.color, transition: 'width 0.3s ease, background 0.3s ease' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                        {newPassword.length >= 6
                          ? <CheckCircle size={12} color="var(--color-success)" />
                          : <XCircle size={12} color="var(--color-text-light)" />}
                        <span style={{ fontSize: '0.75rem', color: newPassword.length >= 6 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                          কমপক্ষে ৬ অক্ষর
                        </span>
                        {newPassword && (
                          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
                            {strength.label}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {errors.newPassword && (
                    <span className="form-error">
                      <AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />{errors.newPassword}
                    </span>
                  )}
                </div>

                {/* ── Confirm password ── */}
                <div className="form-group">
                  <label className="form-label">
                    পাসওয়ার্ড নিশ্চিত করুন <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="forgot-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      className={`form-input ${errors.confirmPassword ? 'error' : confirmPassword && confirmPassword === newPassword ? 'success' : ''}`}
                      placeholder="পাসওয়ার্ডটি আবার লিখুন"
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(p => !p)} aria-label="নিশ্চিত পাসওয়ার্ড দেখুন">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword === newPassword && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                      <CheckCircle size={12} /> পাসওয়ার্ড মিলেছে
                    </span>
                  )}
                  {errors.confirmPassword && (
                    <span className="form-error">
                      <AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />{errors.confirmPassword}
                    </span>
                  )}
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit"
                  id="forgot-reset-btn"
                  className="btn btn-accent w-full"
                  style={{ marginTop: '0.5rem' }}
                  disabled={loading}
                >
                  {loading
                    ? <Loader variant="button" text="পরিবর্তন হচ্ছে..." />
                    : 'পাসওয়ার্ড পরিবর্তন করুন ✨'
                  }
                </button>

                {/* Back to email step */}
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(['','','','','','']); setErrors({}); setServerError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'center', width: '100%', marginTop: '0.25rem' }}
                >
                  ← ইমেইল পরিবর্তন করুন
                </button>
              </form>
            </div>
          )}
        </div>

        <p className={styles.footerNote}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </p>
      </div>
    </main>
  );
}
