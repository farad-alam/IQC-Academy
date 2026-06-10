'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../login/login.module.css'; // Reusing login styles for consistency

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', mobile: '', email: '', facebook: '',
    institution: '', division: '', district: '', upazila: '',
    dob: '', sscYear: '', sscBoard: '', sscGpa: '',
    whatsapp: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    const errs = {};
    if (!form.name) errs.name = 'নাম আবশ্যক';
    if (!form.mobile) errs.mobile = 'মোবাইল নম্বর আবশ্যক';
    else if (!/^01\d{9}$/.test(form.mobile)) errs.mobile = 'সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন';
    if (!form.email) errs.email = 'ইমেইল আবশ্যক';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'সঠিক ইমেইল দিন';
    if (!form.dob) errs.dob = 'জন্মতারিখ আবশ্যক';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.institution) errs.institution = 'প্রতিষ্ঠানের নাম আবশ্যক';
    if (!form.division) errs.division = 'বিভাগ নির্বাচন করুন';
    if (!form.district) errs.district = 'জেলা নির্বাচন করুন';
    if (!form.sscYear) errs.sscYear = 'এসএসসি পাশের সাল আবশ্যক';
    return errs;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!form.whatsapp) errs.whatsapp = 'WhatsApp নম্বর আবশ্যক';
    if (!form.password) errs.password = 'পাসওয়ার্ড আবশ্যক';
    else if (form.password.length < 6) errs.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'পাসওয়ার্ড মিলছে না';
    return errs;
  };

  const handleNext = () => {
    let errs = {};
    if (step === 1) errs = validateStep1();
    if (step === 2) errs = validateStep2();
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep3();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    // Simulate API
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    window.location.href = '/register/success';
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

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
            <span style={{ color: step >= 1 ? 'var(--color-primary)' : '' }}>ব্যক্তিগত তথ্য</span>
            <span style={{ color: step >= 2 ? 'var(--color-primary)' : '' }}>শিক্ষা ও ঠিকানা</span>
            <span style={{ color: step >= 3 ? 'var(--color-primary)' : '' }}>নিরাপত্তা</span>
          </div>
        </div>

        <div className={styles.card}>
          <form className={styles.form} noValidate>
            
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label required">পুরো নাম (বাংলায় বা ইংরেজিতে)</label>
                  <input type="text" className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={handleChange('name')} placeholder="আপনার নাম লিখুন" />
                  {errors.name && <span className="form-error">⚠ {errors.name}</span>}
                </div>
                
                <div className="grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label required">মোবাইল নম্বর</label>
                    <input type="tel" className={`form-input ${errors.mobile ? 'error' : ''}`} value={form.mobile} onChange={handleChange('mobile')} placeholder="01XXXXXXXXX" />
                    {errors.mobile && <span className="form-error">⚠ {errors.mobile}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label required">জন্মতারিখ</label>
                    <input type="date" className={`form-input ${errors.dob ? 'error' : ''}`} value={form.dob} onChange={handleChange('dob')} />
                    {errors.dob && <span className="form-error">⚠ {errors.dob}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label required">ইমেইল ঠিকানা</label>
                  <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={handleChange('email')} placeholder="example@email.com" />
                  {errors.email && <span className="form-error">⚠ {errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">ফেসবুক প্রোফাইল লিংক (ঐচ্ছিক)</label>
                  <input type="url" className="form-input" value={form.facebook} onChange={handleChange('facebook')} placeholder="https://facebook.com/..." />
                </div>
              </div>
            )}

            {/* STEP 2: Education & Address */}
            {step === 2 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label required">বর্তমান প্রতিষ্ঠানের নাম</label>
                  <input type="text" className={`form-input ${errors.institution ? 'error' : ''}`} value={form.institution} onChange={handleChange('institution')} placeholder="স্কুল/কলেজ/বিশ্ববিদ্যালয়" />
                  {errors.institution && <span className="form-error">⚠ {errors.institution}</span>}
                </div>

                <div className="grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label required">বিভাগ</label>
                    <select className={`form-input form-select ${errors.division ? 'error' : ''}`} value={form.division} onChange={handleChange('division')}>
                      <option value="">নির্বাচন করুন</option>
                      <option value="ঢাকা">ঢাকা</option>
                      <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                      <option value="রাজশাহী">রাজশাহী</option>
                      <option value="খুলনা">খুলনা</option>
                      <option value="সিলেট">সিলেট</option>
                      <option value="বরিশাল">বরিশাল</option>
                      <option value="রংপুর">রংপুর</option>
                      <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                    </select>
                    {errors.division && <span className="form-error">⚠ {errors.division}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label required">জেলা</label>
                    <input type="text" className={`form-input ${errors.district ? 'error' : ''}`} value={form.district} onChange={handleChange('district')} placeholder="আপনার জেলা" />
                    {errors.district && <span className="form-error">⚠ {errors.district}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">উপজেলা (ঐচ্ছিক)</label>
                  <input type="text" className="form-input" value={form.upazila} onChange={handleChange('upazila')} placeholder="আপনার উপজেলা" />
                </div>

                <div className="divider" style={{ margin: '0.5rem 0' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>এসএসসি বা সমমান পরীক্ষার তথ্য</p>

                <div className="grid-3 gap-4">
                  <div className="form-group">
                    <label className="form-label required">পাশের সাল</label>
                    <input type="text" className={`form-input ${errors.sscYear ? 'error' : ''}`} value={form.sscYear} onChange={handleChange('sscYear')} placeholder="যেমন: 2018" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">বোর্ড</label>
                    <input type="text" className="form-input" value={form.sscBoard} onChange={handleChange('sscBoard')} placeholder="যেমন: ঢাকা" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">জিপিএ</label>
                    <input type="text" className="form-input" value={form.sscGpa} onChange={handleChange('sscGpa')} placeholder="যেমন: 5.00" />
                  </div>
                </div>
                {errors.sscYear && <span className="form-error">⚠ {errors.sscYear}</span>}
              </div>
            )}

            {/* STEP 3: Security */}
            {step === 3 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label required">WhatsApp নম্বর</label>
                  <input type="tel" className={`form-input ${errors.whatsapp ? 'error' : ''}`} value={form.whatsapp} onChange={handleChange('whatsapp')} placeholder="01XXXXXXXXX (গুরুত্বপূর্ণ আপডেটের জন্য)" />
                  <span className="form-hint">ক্লাসের লিংক ও নোটিফিকেশন এই নম্বরে পাঠানো হবে।</span>
                  {errors.whatsapp && <span className="form-error">⚠ {errors.whatsapp}</span>}
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label required">পাসওয়ার্ড</label>
                  <input type="password" className={`form-input ${errors.password ? 'error' : ''}`} value={form.password} onChange={handleChange('password')} placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড" />
                  {errors.password && <span className="form-error">⚠ {errors.password}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label required">পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="পুনরায় পাসওয়ার্ডটি লিখুন" />
                  {errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword}</span>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              {step > 1 && (
                <button type="button" onClick={handlePrev} className="btn btn-outline" style={{ flex: 1 }}>
                  পেছনে
                </button>
              )}
              
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="btn btn-primary" style={{ flex: step === 1 ? 1 : 2 }}>
                  পরবর্তী ধাপ
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} className="btn btn-accent" style={{ flex: 2 }} disabled={loading}>
                  {loading ? <><span className="spinner spinner-sm"/> সাবমিট হচ্ছে...</> : 'রেজিস্ট্রেশন সম্পন্ন করুন ✨'}
                </button>
              )}
            </div>

          </form>

          <div className="divider-ornament">অথবা</div>

          <p className={styles.registerLink}>
            ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className={styles.registerLinkAnchor}>
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
