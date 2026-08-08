'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock, ShieldCheck, CheckCircle, AlertTriangle, Clock, Phone } from 'lucide-react';

export default function EnrollmentForm({ course, settings, initialPaymentStatus }) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [txId, setTxId] = useState('');
  const [mobile, setMobile] = useState('');
  const [step, setStep] = useState(1); // 1: Select Method, 2: Enter TxID, 3: Success
  const [error, setError] = useState('');
  const router = useRouter();

  // If there's already a pending payment, show that status immediately
  const [paymentStatus] = useState(initialPaymentStatus || null);

  // ── PENDING STATE ─────────────────────────────────────────
  if (paymentStatus?.status === 'PENDING') {
    return (
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
        <Link href={`/learn/${course.id}`} className="btn btn-ghost" style={{ padding: 0, marginBottom: '2rem' }}>
          <ChevronLeft size={20} /> কোর্সে ফিরে যান
        </Link>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Clock size={40} color="#d97706" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#92400e' }}>
            পেমেন্ট যাচাইয়ের অপেক্ষায়
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            আপনার পেমেন্ট সফলভাবে জমা দেওয়া হয়েছে। এডমিন কয়েক ঘণ্টার মধ্যে আপনার পেমেন্ট যাচাই করবেন এবং কোর্সটি চালু করে দেবেন।
          </p>
          <div style={{ background: 'var(--color-surface-alt)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>পেমেন্ট মেথড</span>
              <strong>{paymentStatus.donation?.method}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>ট্রানজেকশন ID</span>
              <strong style={{ fontFamily: 'monospace' }}>{paymentStatus.donation?.txId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>পরিমাণ</span>
              <strong>৳{paymentStatus.donation?.amount}</strong>
            </div>
          </div>
          {settings?.contact_phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: 'var(--color-primary)', fontSize: '0.875rem' }}>
              <Phone size={16} />
              <span>সমস্যায় যোগাযোগ করুন: <strong>{settings.contact_phone}</strong></span>
            </div>
          )}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn btn-primary">ড্যাশবোর্ডে যান</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── REJECTED STATE ────────────────────────────────────────
  if (paymentStatus?.status === 'REJECTED' && step === 1 && !paymentMethod) {
    // Show a banner about rejection, then allow re-submission below
  }

  const handleEnrollFree = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push(`/learn/${course.id}`);
        router.refresh();
      } else {
        setError(data.error || 'কোর্সে ভর্তি হতে সমস্যা হয়েছে।');
        setLoading(false);
      }
    } catch {
      setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
      setLoading(false);
    }
  };

  const handleEnrollPaid = async (e) => {
    e.preventDefault();
    setError('');
    if (!txId.trim() || !mobile.trim() || !paymentMethod) {
      setError('সব তথ্য সঠিকভাবে পূরণ করুন।');
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(mobile.trim())) {
      setError('সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)।');
      return;
    }
    if (txId.trim().length < 4) {
      setError('সঠিক Transaction ID দিন।');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll/paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: paymentMethod, txId: txId.trim(), mobile: mobile.trim() })
      });
      const data = await res.json();

      if (data.success) {
        setStep(3); // Show success card
      } else if (data.error === 'PAYMENT_PENDING') {
        setError(data.message || 'আপনার একটি পেমেন্ট ইতোমধ্যে যাচাইয়ের অপেক্ষায় আছে।');
      } else {
        setError(data.error || 'পেমেন্ট জমা দিতে সমস্যা হয়েছে।');
      }
      setLoading(false);
    } catch {
      setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
      setLoading(false);
    }
  };

  // ── STEP 3: SUCCESS CARD ───────────────────────────────────
  if (step === 3) {
    return (
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ width: '88px', height: '88px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', animation: 'pulse 2s infinite' }}>
            <CheckCircle size={48} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', color: '#15803d' }}>
            পেমেন্ট সফলভাবে জমা দেওয়া হয়েছে!
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', lineHeight: 1.7 }}>
            আপনার পেমেন্ট তথ্য আমাদের সিস্টেমে সংরক্ষিত হয়েছে।
          </p>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            <strong>এডমিন কয়েক ঘণ্টার মধ্যে আপনার পেমেন্ট যাচাই করবেন</strong> এবং কোর্সটি আনলক হয়ে যাবে। অনুমোদন হলে আপনার ইমেইলে নিশ্চিতকরণ জানানো হবে।
          </p>

          {/* Info box */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600, color: '#15803d' }}>
              <ShieldCheck size={18} /> পেমেন্টের স্ট্যাটাস
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <li>✅ পেমেন্ট তথ্য গ্রহণ করা হয়েছে</li>
              <li>⏳ এডমিন যাচাই করার পর আপনার কোর্স চালু হবে</li>
              <li>📧 অনুমোদনের পর ইমেইলে নিশ্চিতকরণ পাঠানো হবে</li>
            </ul>
          </div>

          {settings?.contact_phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#92400e' }}>
              <Phone size={16} />
              <span>পেমেন্ট সমস্যায় জরুরি যোগাযোগ: <strong>{settings.contact_phone}</strong></span>
            </div>
          )}

          <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
            ড্যাশবোর্ডে যান
          </Link>
        </div>
      </div>
    );
  }

  // ── MAIN FORM ─────────────────────────────────────────────
  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
      <Link href={`/learn/${course.id}`} className="btn btn-ghost" style={{ padding: 0, marginBottom: '2rem' }}>
        <ChevronLeft size={20} /> কোর্সে ফিরে যান
      </Link>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>কোর্সে ভর্তি হোন</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{course.title}</p>
        </div>

        {/* Rejection notice */}
        {paymentStatus?.status === 'REJECTED' && (
          <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem 1.25rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', marginBottom: '1.5rem' }}>
            <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: '0.25rem' }}>পেমেন্ট প্রত্যাখ্যাত হয়েছে</div>
              <div style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
                {paymentStatus.donation?.rejectionReason || 'আপনার পূর্ববর্তী পেমেন্ট যাচাই করা যায়নি।'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#991b1b', marginTop: '0.25rem' }}>নিচে পুনরায় সঠিক তথ্য দিয়ে পেমেন্ট করুন।</div>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: 'var(--color-surface-alt)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--color-earth-2)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>কোর্স ফি</span>
            <span style={{ fontWeight: 600 }}>৳ {course.price?.toString() || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            <span>সর্বমোট প্রদেয়</span>
            <span style={{ fontFamily: 'var(--font-latin)' }}>৳ {course.price?.toString() || 0}</span>
          </div>
        </div>

        {course.type === 'PAID' ? (
          step === 1 ? (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>পেমেন্ট পদ্ধতি নির্বাচন করুন</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {settings?.bkash_number && (
                  <button
                    onClick={() => { setPaymentMethod('BKASH'); setStep(2); }}
                    className="btn btn-outline"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', height: 'auto', borderColor: '#E2136E', transition: 'all 0.2s' }}
                  >
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E2136E' }}>bKash</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>বিকাশ পেমেন্ট</span>
                  </button>
                )}
                {settings?.nagad_number && (
                  <button
                    onClick={() => { setPaymentMethod('NAGAD'); setStep(2); }}
                    className="btn btn-outline"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', height: 'auto', borderColor: '#F26922', transition: 'all 0.2s' }}
                  >
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F26922' }}>Nagad</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>নগদ পেমেন্ট</span>
                  </button>
                )}
                {settings?.rocket_number && (
                  <button
                    onClick={() => { setPaymentMethod('ROCKET'); setStep(2); }}
                    className="btn btn-outline"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', height: 'auto', borderColor: '#8B5CF6', transition: 'all 0.2s' }}
                  >
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8B5CF6' }}>Rocket</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>রকেট পেমেন্ট</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleEnrollPaid} style={{ marginBottom: '2rem' }}>
              {/* Payment number display */}
              <div style={{ padding: '1.25rem', backgroundColor: paymentMethod === 'BKASH' ? '#fdf2f8' : paymentMethod === 'NAGAD' ? '#fff7ed' : '#f5f3ff', borderRadius: '10px', marginBottom: '1.5rem', textAlign: 'center', border: `1px solid ${paymentMethod === 'BKASH' ? '#f9a8d4' : paymentMethod === 'NAGAD' ? '#fed7aa' : '#c4b5fd'}` }}>
                <p style={{ fontWeight: 700, color: paymentMethod === 'BKASH' ? '#E2136E' : paymentMethod === 'NAGAD' ? '#F26922' : '#7C3AED', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  নিচের নম্বরে ৳{course.price?.toString()} সেন্ড মানি করুন
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '2px', fontFamily: 'var(--font-latin)' }}>
                  {paymentMethod === 'BKASH' ? (settings?.bkash_number || '—') : paymentMethod === 'NAGAD' ? (settings?.nagad_number || '—') : (settings?.rocket_number || '—')}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>(Personal Number)</p>
              </div>

              {error && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', color: '#b91c1c' }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="senderMobile">যে নম্বর থেকে টাকা পাঠিয়েছেন</label>
                <input
                  id="senderMobile"
                  name="senderMobile"
                  type="tel"
                  inputMode="numeric"
                  placeholder="01XXXXXXXXX"
                  className="input"
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  required
                  autoComplete="tel"
                />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label htmlFor="txId">Transaction ID (TxID)</label>
                <input
                  id="txId"
                  name="txId"
                  type="text"
                  placeholder="যেমন: 8N2K5H9P"
                  className="input"
                  value={txId}
                  onChange={e => setTxId(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => { setStep(1); setPaymentMethod(''); setError(''); }} className="btn btn-outline" style={{ flex: 1 }}>
                  পেছনে যান
                </button>
                <button type="submit" className="btn btn-accent" style={{ flex: 2 }} disabled={loading}>
                  {loading ? 'প্রসেস হচ্ছে...' : '✅ পেমেন্ট সাবমিট করুন'}
                </button>
              </div>
            </form>
          )
        ) : (
          <div style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--color-success)', fontWeight: 600 }}>
            এই কোর্সটি সম্পূর্ণ ফ্রি!
            <button
              onClick={handleEnrollFree}
              className="btn btn-primary w-full"
              style={{ padding: '1rem', marginTop: '1.5rem' }}
              disabled={loading}
            >
              {loading ? 'প্রসেস হচ্ছে...' : 'ফ্রি ভর্তি হোন'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
