'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, CheckCircle, Ban, ShieldAlert } from 'lucide-react';

export default function UserActionsMenu({ userId, currentStatus, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const doAction = async (action) => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'কোনো সমস্যা হয়েছে।');
      } else {
        if (onUpdate) onUpdate();
        else router.refresh();
      }
    } catch {
      alert('নেটওয়ার্ক সমস্যা।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        className="btn btn-ghost btn-sm"
        style={{ padding: '0.5rem' }}
        onClick={() => setOpen((p) => !p)}
        disabled={loading}
      >
        <MoreVertical size={18} color="var(--color-text-muted)" />
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', zIndex: 50,
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-earth-1)',
          borderRadius: '10px', padding: '0.5rem', minWidth: '160px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          {currentStatus !== 'ACTIVE' && (
            <button
              onClick={() => doAction('APPROVE')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 0.75rem', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', color: 'var(--color-success)', fontSize: '0.875rem' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <CheckCircle size={15} /> অনুমোদন করুন
            </button>
          )}
          {currentStatus !== 'BANNED' && (
            <button
              onClick={() => doAction('BAN')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 0.75rem', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', color: 'var(--color-error)', fontSize: '0.875rem' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Ban size={15} /> ব্যান করুন
            </button>
          )}
        </div>
      )}
    </div>
  );
}
