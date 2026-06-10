'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    window.location.href = '/admin/dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Lock size={32} />
        </div>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-latin)' }}>IQC Academy</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>এডমিন প্যানেলে লগইন করুন</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">ইমেইল</label>
            <input type="email" className="form-input" placeholder="admin@iqcacademy.com" required defaultValue="admin@iqcacademy.com" />
          </div>
          <div className="form-group">
            <label className="form-label">পাসওয়ার্ড</label>
            <input type="password" className="form-input" placeholder="••••••••" required defaultValue="password123" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> প্রবেশ হচ্ছে...</> : 'লগইন করুন'}
          </button>
        </form>

        <div style={{ marginTop: '2rem' }}>
          <Link href="/" className="btn btn-ghost btn-sm">
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
