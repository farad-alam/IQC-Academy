'use client';
import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function ProtectedDeleteModal({ isOpen, onClose, onConfirm, title = 'নিশ্চিত করুন', message = 'এই আইটেমটি মুছে ফেলতে সিকিউরিটি কী (Security Key) প্রদান করুন।' }) {
  const [securityKey, setSecurityKey] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!securityKey) {
      alert('দয়া করে সিকিউরিটি কী প্রদান করুন');
      return;
    }
    setLoading(true);
    try {
      await onConfirm(securityKey);
    } finally {
      setLoading(false);
      setSecurityKey('');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--color-surface)', width: '100%', maxWidth: '450px',
        borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-earth-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} /> {title}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {message}
          </p>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">সিকিউরিটি কী (Security Key)</label>
            <input 
              type="password" 
              value={securityKey} 
              onChange={(e) => setSecurityKey(e.target.value)} 
              className="form-input" 
              placeholder="পাসওয়ার্ড লিখুন..." 
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>বাতিল</button>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }} disabled={loading}>
              {loading ? 'মুছে ফেলা হচ্ছে...' : 'মুছে ফেলুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
