'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle } from 'lucide-react';
import styles from '@/app/login/login.module.css';
import Loader from '@/components/ui/Loader';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.error.includes('Forbidden')) {
          setError('আপনার অ্যাডমিন অ্যাক্সেস নেই।');
        } else {
          setError(data.error || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
        }
        return;
      }

      // Success — redirect to admin dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Lock size={32} />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-latin)' }}>IQC Academy</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>এডমিন প্যানেলে লগইন করুন</p>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)',
            padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
            fontSize: '0.875rem', textAlign: 'left'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">ইমেইল</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@iqcacademy.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">পাসওয়ার্ড</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? <Loader variant="button" text="প্রবেশ হচ্ছে..." /> : 'লগইন করুন'}
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

