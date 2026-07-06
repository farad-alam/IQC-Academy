'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

export default function DonationActions({ donationId, status }) {
  const [loading, setLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState('');
  const router = useRouter();

  if (status !== 'PENDING') return null;

  const doAction = async (action, rejectionReason) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/donations/${donationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejectionReason }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'কোনো সমস্যা হয়েছে।');
      } else {
        router.refresh();
      }
    } catch {
      alert('নেটওয়ার্ক সমস্যা।');
    } finally {
      setLoading(false);
      setShowReject(false);
    }
  };

  if (showReject) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="বাতিলের কারণ..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: 'var(--color-error)', color: 'white', flex: 1 }}
            onClick={() => doAction('REJECT', reason || 'No reason provided')}
            disabled={loading}
          >
            নিশ্চিত করুন
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => setShowReject(false)} disabled={loading}>
            বাতিল
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
      <button
        className="btn btn-ghost btn-sm"
        style={{ padding: '0.4rem 0.6rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
        onClick={() => doAction('VERIFY')}
        disabled={loading}
        title="যাচাই করুন"
      >
        <CheckCircle size={16} /> যাচাই
      </button>
      <button
        className="btn btn-ghost btn-sm"
        style={{ padding: '0.4rem 0.6rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
        onClick={() => setShowReject(true)}
        disabled={loading}
        title="বাতিল করুন"
      >
        <XCircle size={16} /> বাতিল
      </button>
    </div>
  );
}
