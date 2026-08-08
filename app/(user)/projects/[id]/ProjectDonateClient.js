'use client';
import { useState } from 'react';
import { CheckCircle2, Copy } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import Link from 'next/link';
import styles from './ProjectDonateClient.module.css';

export default function ProjectDonateClient({ project, settings }) {
  const [form, setForm] = useState({ name: '', mobile: '', amount: '', txId: '', method: 'BKASH' });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const target = Number(project.targetAmount) || 1;
  const raised = Number(project.raisedAmount) || 0;
  const progress = Math.min(100, Math.round((raised / target) * 100));

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.amount || !form.txId || !form.mobile) return alert('পরিমাণ, ট্রানজেকশন আইডি এবং মোবাইল নম্বর আবশ্যক');
    
    setLoading(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          projectId: project.id // Attach the project ID
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || data.error || 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setErrorMsg('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const setAmount = (val) => {
    setForm(prev => ({ ...prev, amount: val }));
  };

  if (submitted) {
    return (
      <div className={styles.pageWrapper}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className={`card ${styles.successCard}`}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={40} />
            </div>
            <h2 className={styles.successTitle}>জাযাকাল্লাহু খাইরান</h2>
            <p className={styles.successMsg}>
              আপনার দান সফলভাবে জমা হয়েছে। অ্যাডমিন ভেরিফিকেশনের পর প্রজেক্টের সংগ্রহে যুক্ত হবে। আল্লাহ আপনার এই দানকে কবুল করুন।
            </p>
            <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ marginRight: '1rem' }}>
              আরও দান করুন
            </button>
            <Link href="/projects" className="btn btn-primary">
              সকল প্রজেক্ট
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* Left Column: Project Details */}
        <div>
          <div className={styles.projectDetails}>
            <div className={styles.imageWrapper}>
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className={styles.projectImage} />
              ) : (
                <div className={styles.fallbackIcon}>{project.icon || '🎯'}</div>
              )}
            </div>
            
            <div className={styles.contentWrapper}>
              <h1 className={styles.projectTitle}>{project.title}</h1>
              
              <div className={styles.progressSection}>
                <div className={styles.progressStats}>
                  <span style={{ color: 'var(--color-primary-dark)' }}>সংগৃহীত: ৳{raised.toLocaleString('bn-BD')}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>লক্ষ্য: ৳{target.toLocaleString('bn-BD')}</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>
                <div className={styles.progressPercentage}>{progress}% সম্পন্ন</div>
              </div>
              
              <div className={styles.projectDesc} style={{ whiteSpace: 'pre-wrap' }}>
                {project.description}
              </div>
              
              <div className={styles.quoteCard}>
                "যে ব্যক্তি আল্লাহর রাস্তায় নিজের সম্পদ ব্যয় করে, তার উদাহরণ ঐ বীজের মতো, যা থেকে সাতটি শীষ জন্মায় এবং প্রতিটি শীষে থাকে একশটি করে দানা।" <br/>
                <strong style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.9rem' }}>— (সূরা বাকারাহ: ২৬১)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Donation Form */}
        <div>
          <div className={styles.donationSticky}>
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>এই প্রজেক্টে দান করুন</h2>
              <p className={styles.formSubtitle}>নিচের ফর্মটি পূরণ করে আপনার দান সম্পন্ন করুন</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Amount Selection */}
                <div>
                  <label className="form-label" style={{ marginBottom: '0.75rem' }}>পরিমাণ নির্বাচন করুন (৳) *</label>
                  <div className={styles.quickAmounts}>
                    {quickAmounts.map(amt => (
                      <button 
                        key={amt} 
                        type="button"
                        className={`${styles.amountBtn} ${Number(form.amount) === amt ? styles.active : ''}`}
                        onClick={() => setAmount(amt)}
                      >
                        {amt.toLocaleString('bn-BD')}
                      </button>
                    ))}
                    <button 
                        type="button"
                        className={`${styles.amountBtn} ${form.amount && !quickAmounts.includes(Number(form.amount)) ? styles.active : ''}`}
                        onClick={() => setAmount('')}
                      >
                        অন্যান্য
                    </button>
                  </div>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={form.amount} 
                    onChange={handleChange('amount')} 
                    placeholder="পছন্দের পরিমাণ লিখুন" 
                    required 
                    min="10"
                  />
                </div>

                {/* Donor Details */}
                <div className="form-group">
                  <label className="form-label">আপনার নাম (বা যার পক্ষে দান করছেন)</label>
                  <input type="text" className="form-input" value={form.name} onChange={handleChange('name')} placeholder="নাম লিখুন" />
                </div>
                <div className="form-group">
                  <label className="form-label required">মোবাইল নম্বর (যে নম্বর থেকে টাকা পাঠিয়েছেন)</label>
                  <input type="tel" className="form-input" value={form.mobile} onChange={handleChange('mobile')} placeholder="01XXXXXXXXX" required />
                </div>

                {/* Payment Method */}
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '1rem' }}>পেমেন্ট মাধ্যম *</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                      { id: 'BKASH', name: 'বিকাশ', brand: 'bKash', color: '#e2136e' },
                      { id: 'NAGAD', name: 'নগদ', brand: 'Nagad', color: '#ed1c24' },
                      { id: 'ROCKET', name: 'রকেট', brand: 'Rocket', color: '#8c1515' }
                    ].map(method => (
                      <label key={method.id} style={{ 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', flex: 1, padding: '1rem', 
                        border: form.method === method.id ? `2px solid ${method.color}` : '1px solid var(--color-earth-1)', 
                        borderRadius: '12px', 
                        backgroundColor: form.method === method.id ? `${method.color}10` : 'transparent',
                        transition: 'all 0.2s', position: 'relative'
                      }}>
                        <input type="radio" name="method" value={method.id} checked={form.method === method.id} onChange={handleChange('method')} style={{ position: 'absolute', opacity: 0 }} />
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: method.color, letterSpacing: '-0.5px' }}>{method.brand}</div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{method.name}</span>
                        {form.method === method.id && (
                          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: method.color }}>
                            <CheckCircle2 size={16} fill={method.color} color="#fff" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Instruction Box */}
                <div style={{ padding: '1.25rem', backgroundColor: form.method === 'BKASH' ? '#e2136e0d' : form.method === 'NAGAD' ? '#ed1c240d' : '#8c15150d', borderRadius: '8px', borderLeft: `4px solid ${form.method === 'BKASH' ? '#e2136e' : form.method === 'NAGAD' ? '#ed1c24' : '#8c1515'}` }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-text-muted)' }}>
                    নিচের নাম্বারে <strong>Send Money</strong> করুন এবং ট্রানজেকশন আইডি দিন।
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px dashed var(--color-earth-2)' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-latin)', color: form.method === 'BKASH' ? '#e2136e' : form.method === 'NAGAD' ? '#ed1c24' : '#8c1515' }}>
                      {form.method === 'BKASH' ? (settings?.bkash_number || '01700000000') : form.method === 'NAGAD' ? (settings?.nagad_number || '01800000000') : (settings?.rocket_number || '01900000000')}
                    </span>
                    <button type="button" onClick={() => copyToClipboard(form.method === 'BKASH' ? settings?.bkash_number : form.method === 'NAGAD' ? settings?.nagad_number : settings?.rocket_number)} className="btn btn-ghost btn-sm" title="কপি করুন">
                      {copied ? <CheckCircle2 size={18} color="var(--color-success)" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label required">ট্রানজেকশন আইডি (TxnID)</label>
                  <input type="text" className="form-input" value={form.txId} onChange={handleChange('txId')} placeholder="উদা: 8H7D..." required style={{ textTransform: 'uppercase' }} />
                </div>

                {errorMsg && (
                  <div style={{ padding: '1rem', backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', borderRadius: '8px', fontSize: '0.875rem' }}>
                    {errorMsg}
                  </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <Loader variant="button" text="অপেক্ষা করুন..." /> : 'দান সম্পন্ন করুন'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
