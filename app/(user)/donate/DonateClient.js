'use client';
import { useState } from 'react';
import { Heart, Copy, CheckCircle2 } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import Link from 'next/link';

export default function DonateClient({ settings }) {
  const [form, setForm] = useState({ name: '', mobile: '', amount: '', txId: '', method: 'BKASH' });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
          amount: Number(form.amount)
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

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>দান সম্পন্ন করার ফর্ম</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Payment Method Selector */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '1rem' }}>পেমেন্ট মাধ্যম নির্বাচন করুন *</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { id: 'BKASH', name: 'বিকাশ', brand: 'bKash', color: '#e2136e' },
                  { id: 'NAGAD', name: 'নগদ', brand: 'Nagad', color: '#ed1c24' },
                  { id: 'ROCKET', name: 'রকেট', brand: 'Rocket', color: '#8c1515' }
                ].map(method => (
                  <label key={method.id} style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', cursor: 'pointer', flex: 1, padding: '1rem', 
                    border: form.method === method.id ? `2px solid ${method.color}` : '1px solid var(--color-earth-1)', 
                    borderRadius: '12px', 
                    backgroundColor: form.method === method.id ? `${method.color}10` : 'transparent',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}>
                    <input type="radio" name="method" value={method.id} checked={form.method === method.id} onChange={(e) => setForm(p => ({...p, method: e.target.value}))} style={{ position: 'absolute', opacity: 0 }} />
                    
                    {/* Simulated Brand Logo using text */}
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: method.color, letterSpacing: '-0.5px' }}>
                      {method.brand}
                    </div>
                    
                    <span style={{ fontWeight: form.method === method.id ? 600 : 400, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {method.name}
                    </span>

                    {/* Checkmark indicator */}
                    {form.method === method.id && (
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: method.color }}>
                        <CheckCircle2 size={16} fill={method.color} color="#fff" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Instruction Box based on selected method */}
            <div style={{ padding: '1.25rem', backgroundColor: form.method === 'BKASH' ? '#e2136e0d' : form.method === 'NAGAD' ? '#ed1c240d' : '#8c15150d', borderRadius: '8px', borderLeft: `4px solid ${form.method === 'BKASH' ? '#e2136e' : form.method === 'NAGAD' ? '#ed1c24' : '#8c1515'}`, marginBottom: '0.5rem', transition: 'all 0.3s' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-text-muted)' }}>
                নিচের নাম্বারে <strong>Send Money</strong> করুন এবং ট্রানজেকশন আইডি ফর্মটিতে দিন।
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px dashed var(--color-earth-2)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-latin)', color: form.method === 'BKASH' ? '#e2136e' : form.method === 'NAGAD' ? '#ed1c24' : '#8c1515' }}>
                  {form.method === 'BKASH' ? (settings?.bkash_number || '01700000000') : form.method === 'NAGAD' ? (settings?.nagad_number || '01800000000') : (settings?.rocket_number || '01900000000')}
                </span>
                <button type="button" onClick={() => copyToClipboard(form.method === 'BKASH' ? settings?.bkash_number : form.method === 'NAGAD' ? settings?.nagad_number : settings?.rocket_number)} className="btn btn-ghost btn-sm" style={{ padding: '0.5rem' }} title="কপি করুন">
                  {copied ? <CheckCircle2 size={18} color="var(--color-success)" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', borderRadius: '8px', fontSize: '0.875rem' }}>
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">নাম (ঐচ্ছিক)</label>
              <input type="text" className="form-input" value={form.name} onChange={handleChange('name')} placeholder="আপনার নাম" />
            </div>
            <div className="form-group">
              <label className="form-label required">মোবাইল নম্বর (যে নম্বর থেকে টাকা পাঠিয়েছেন)</label>
              <input type="tel" className="form-input" value={form.mobile} onChange={handleChange('mobile')} placeholder="01XXXXXXXXX" required />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label required">পরিমাণ (টাকা)</label>
                <input type="number" className="form-input" value={form.amount} onChange={handleChange('amount')} placeholder="উদা: 1000" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label required">ট্রানজেকশন আইডি (TxnID)</label>
                <input type="text" className="form-input" value={form.txId} onChange={handleChange('txId')} placeholder="উদা: 8H7D..." required style={{ textTransform: 'uppercase' }} />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
              {loading ? <Loader variant="button" text="সাবমিট হচ্ছে..." /> : 'তথ্য সাবমিট করুন'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
