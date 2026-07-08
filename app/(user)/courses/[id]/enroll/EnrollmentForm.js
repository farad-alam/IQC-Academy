'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock, ShieldCheck, HelpCircle } from 'lucide-react';

export default function EnrollmentForm({ course }) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'BKASH' | 'NAGAD'
  const [txId, setTxId] = useState('');
  const [mobile, setMobile] = useState('');
  const [step, setStep] = useState(1); // 1: Select Method, 2: Enter TxID
  const router = useRouter();

  const handleEnrollFree = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.success) {
        router.push(`/courses/${course.id}`);
        router.refresh();
      } else {
        alert(data.error || 'Failed to enroll');
        setLoading(false);
      }
    } catch (err) {
      alert('An error occurred');
      setLoading(false);
    }
  };

  const handleEnrollPaid = async (e) => {
    e.preventDefault();
    if (!txId || !mobile || !paymentMethod) {
      alert('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll/paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: paymentMethod, txId, mobile })
      });
      const data = await res.json();
      
      if (data.success) {
        alert('পেমেন্ট সফলভাবে জমা দেওয়া হয়েছে! এডমিন যাচাই করার পর আপনার কোর্সটি চালু হবে।');
        router.push('/dashboard');
        router.refresh();
      } else {
        alert(data.error || 'Failed to submit payment');
        setLoading(false);
      }
    } catch (err) {
      alert('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
      <Link href={`/courses/${course.id}`} className="btn btn-ghost" style={{ padding: 0, marginBottom: '2rem' }}>
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

        <div style={{ backgroundColor: 'var(--color-surface-alt)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--color-earth-2)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>কোর্স ফি</span>
            <span style={{ fontWeight: 600 }}>৳ {course.price?.toString() || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            <span>সর্বমোট প্রদেয়</span>
            <span style={{ fontFamily: 'var(--font-latin)' }}>৳ {course.price?.toString() || 0}</span>
          </div>
        </div>

        {course.type === 'PAID' ? (
           step === 1 ? (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>পেমেন্ট পদ্ধতি নির্বাচন করুন</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={() => { setPaymentMethod('BKASH'); setStep(2); }} 
                  className="btn btn-outline" 
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', height: 'auto', borderColor: paymentMethod === 'BKASH' ? '#E2136E' : '' }}
                >
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E2136E' }}>bKash</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>বিকাশ পেমেন্ট</span>
                </button>
                <button 
                  onClick={() => { setPaymentMethod('NAGAD'); setStep(2); }} 
                  className="btn btn-outline" 
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', height: 'auto', borderColor: paymentMethod === 'NAGAD' ? '#F26922' : '' }}
                >
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F26922' }}>Nagad</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>নগদ পেমেন্ট</span>
                </button>
              </div>
            </div>
           ) : (
            <form onSubmit={handleEnrollPaid} style={{ marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                 <p style={{ fontWeight: 600, color: paymentMethod === 'BKASH' ? '#E2136E' : '#F26922', marginBottom: '0.5rem' }}>
                   অনুগ্রহ করে নিচের নম্বরে ৳{course.price?.toString()} সেন্ড মানি করুন
                 </p>
                 <p style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '2px', fontFamily: 'var(--font-latin)' }}>
                   017XXXXXXXX
                 </p>
                 <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                   (Personal Number)
                 </p>
              </div>

              <div className="form-group">
                <label>যে নম্বর থেকে টাকা পাঠিয়েছেন</label>
                <input 
                  type="text" 
                  placeholder="01XXXXXXXXX" 
                  className="input" 
                  value={mobile} 
                  onChange={e => setMobile(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Transaction ID (TxID)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 8N2K5H9P" 
                  className="input" 
                  value={txId} 
                  onChange={e => setTxId(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>
                  পেছনে যান
                </button>
                <button type="submit" className="btn btn-accent" style={{ flex: 2 }} disabled={loading}>
                  {loading ? 'প্রসেস হচ্ছে...' : 'পেমেন্ট সাবমিট করুন'}
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
