'use client';
import { useState } from 'react';
import { Heart, Copy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DonatePage() {
  const [form, setForm] = useState({ name: '', mobile: '', amount: '', txId: '' });
  const [copied, setCopied] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.txId) return alert('পরিমাণ এবং ট্রানজেকশন আইডি আবশ্যক');
    setLoading(true);
    // Simulate API
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '600px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>জাযাকাল্লাহু খাইরান</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            আপনার দান সফলভাবে জমা হয়েছে। আল্লাহ আপনার এই দানকে কবুল করুন এবং এর উত্তম প্রতিদান দান করুন।
          </p>
          <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ marginRight: '1rem' }}>
            আরও দান করুন
          </button>
          <Link href="/" className="btn btn-primary">
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <Heart size={32} />
        </div>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>সদকাহ ও দান</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          "যে ব্যক্তি আল্লাহর রাস্তায় নিজের সম্পদ ব্যয় করে, তার উদাহরণ ঐ বীজের মতো, যা থেকে সাতটি শীষ জন্মায় এবং প্রতিটি শীষে থাকে একশটি করে দানা।" — (সূরা বাকারাহ: ২৬১)
        </p>
      </header>

      <div className="grid-2 gap-6">
        {/* Left: Payment Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--color-earth-1)', paddingBottom: '0.5rem' }}>বিকাশ (Personal)</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-latin)' }}>01712-345678</span>
              <button onClick={() => copyToClipboard('01712345678', 'bkash')} className="btn btn-ghost btn-sm" style={{ padding: '0.5rem' }}>
                {copied === 'bkash' ? <CheckCircle2 size={18} color="var(--color-success)" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--color-earth-1)', paddingBottom: '0.5rem' }}>নগদ (Personal)</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-latin)' }}>01912-345678</span>
              <button onClick={() => copyToClipboard('01912345678', 'nagad')} className="btn btn-ghost btn-sm" style={{ padding: '0.5rem' }}>
                {copied === 'nagad' ? <CheckCircle2 size={18} color="var(--color-success)" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--color-earth-1)', paddingBottom: '0.5rem' }}>রকেট (Personal)</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-latin)' }}>01512-345678-9</span>
              <button onClick={() => copyToClipboard('015123456789', 'rocket')} className="btn btn-ghost btn-sm" style={{ padding: '0.5rem' }}>
                {copied === 'rocket' ? <CheckCircle2 size={18} color="var(--color-success)" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Manual Submission Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>দান সম্পন্ন করার ফর্ম</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            টাকা পাঠানোর পর নিচের ফর্মটি পূরণ করুন। আমাদের টিম দ্রুত আপনার দান ভেরিফাই করে আপডেট করবে।
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">নাম (ঐচ্ছিক)</label>
              <input type="text" className="form-input" value={form.name} onChange={handleChange('name')} placeholder="আপনার নাম" />
            </div>
            <div className="form-group">
              <label className="form-label">মোবাইল নম্বর (যে নম্বর থেকে টাকা পাঠিয়েছেন)</label>
              <input type="tel" className="form-input" value={form.mobile} onChange={handleChange('mobile')} placeholder="01XXXXXXXXX" />
            </div>
            <div className="form-group">
              <label className="form-label required">পরিমাণ (টাকা)</label>
              <input type="number" className="form-input" value={form.amount} onChange={handleChange('amount')} placeholder="উদা: 1000" required />
            </div>
            <div className="form-group">
              <label className="form-label required">ট্রানজেকশন আইডি (TxnID)</label>
              <input type="text" className="form-input" value={form.txId} onChange={handleChange('txId')} placeholder="উদা: 8H7D..." required style={{ textTransform: 'uppercase' }} />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? <><span className="spinner spinner-sm" /> সাবমিট হচ্ছে...</> : 'তথ্য সাবমিট করুন'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
