'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, Ban, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ROLE_LABELS = {
  SUPER_ADMIN: '👑 Super Admin',
  ADMIN: '🛡️ Admin',
  STUDENT: 'শিক্ষার্থী',
};

const STATUS_LABELS = {
  ACTIVE: 'সক্রিয়',
  PENDING: 'অপেক্ষমাণ',
  BANNED: 'ব্যান করা',
};

function statusBadgeClass(status) {
  if (status === 'ACTIVE') return 'badge badge-success';
  if (status === 'PENDING') return 'badge badge-warning';
  return 'badge badge-earth';
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
}

function waLink(phone) {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits.startsWith('88') ? digits : `88${digits}`}`;
}

function Field({ label, children }) {
  const isEmpty = children === null || children === undefined || children === '';
  return (
    <div>
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)', wordBreak: 'break-word' }}>
        {isEmpty ? '—' : children}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {title}
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem 1.5rem' }}>
        {children}
      </div>
    </div>
  );
}

export default function UserDetailsPanel({ userId, currentStatus, targetUserRole, onUpdated }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (!res.ok) throw new Error('Failed to load user');
        const data = await res.json();
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) setError('তথ্য লোড করতে সমস্যা হয়েছে।');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId, reloadKey]);

  const retry = () => {
    setError('');
    setLoading(true);
    setReloadKey(k => k + 1);
  };

  const doAction = async (action) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'কোনো সমস্যা হয়েছে।');
        return;
      }
      setUser(prev => (prev ? { ...prev, status: action === 'APPROVE' ? 'ACTIVE' : 'BANNED' } : prev));
      toast.success(action === 'APPROVE' ? 'ব্যবহারকারী অনুমোদিত হয়েছে।' : 'ব্যবহারকারী ব্যান করা হয়েছে।');
      if (onUpdated) onUpdated();
    } catch {
      toast.error('নেটওয়ার্ক সমস্যা।');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '2rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-alt)', borderRadius: '10px' }}>
        <Loader2 size={18} className="spin" /> ব্যবহারকারীর তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '2rem', color: 'var(--color-error)', background: 'var(--color-surface-alt)', borderRadius: '10px' }}>
        <span>{error}</span>
        <button className="btn btn-outline btn-sm" onClick={retry}>
          <RefreshCw size={14} /> আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  const status = user?.status || currentStatus;
  const canManage = targetUserRole !== 'SUPER_ADMIN';

  return (
    <div style={{ background: 'var(--color-surface-alt)', borderTop: '1px solid var(--color-earth-1)', borderRadius: '10px', padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        ) : (
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, flexShrink: 0 }}>
            {user.name?.charAt(0)}
          </div>
        )}
        <div style={{ flex: 1, minWidth: '150px' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{user.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {ROLE_LABELS[user.role] || user.role} • #{user.id.slice(-6)}
          </div>
        </div>
        <span className={statusBadgeClass(status)}>{STATUS_LABELS[status] || status}</span>
      </div>

      {/* Personal */}
      <Section title="ব্যক্তিগত তথ্য">
        <Field label="ইমেইল">
          <a href={`mailto:${user.email}`} style={{ color: 'var(--color-primary)' }}>{user.email}</a>
        </Field>
        <Field label="মোবাইল">
          {user.mobile ? <a href={`tel:${user.mobile}`} style={{ color: 'var(--color-primary)' }}>{user.mobile}</a> : ''}
        </Field>
        <Field label="হোয়াটসঅ্যাপ">
          {user.whatsapp ? (
            <a href={waLink(user.whatsapp)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
              {user.whatsapp}
            </a>
          ) : ''}
        </Field>
        <Field label="ফেসবুক">
          {user.facebook ? (
            <a href={user.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
              প্রোফাইল দেখুন
            </a>
          ) : ''}
        </Field>
        <Field label="জন্মতারিখ">{formatDate(user.dob)}</Field>
        <Field label="যোগদানের তারিখ">{formatDate(user.createdAt)}</Field>
      </Section>

      {/* Address & Institution */}
      <Section title="ঠিকানা ও প্রতিষ্ঠান">
        <Field label="প্রতিষ্ঠান">{user.institution}</Field>
        <Field label="বিভাগ">{user.division}</Field>
        <Field label="জেলা">{user.district}</Field>
        <Field label="উপজেলা">{user.upazila}</Field>
      </Section>

      {/* Education */}
      <Section title="শিক্ষাগত তথ্য">
        <Field label="এসএসসি পাশের সাল">{user.sscYear}</Field>
        <Field label="বোর্ড">{user.sscBoard}</Field>
        <Field label="রোল নম্বর">{user.sscRoll}</Field>
        <Field label="জিপিএ">{user.sscGpa}</Field>
      </Section>

      {/* Activity */}
      <Section title="কার্যক্রম">
        <Field label="মোট পয়েন্ট">{`${user.totalPoints ?? 0} পয়েন্ট`}</Field>
        <Field label="বর্তমান স্ট্রিক">{`${user.currentStreak ?? 0} দিন`}</Field>
      </Section>

      {/* Actions */}
      {canManage && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end', borderTop: '1px solid var(--color-earth-1)', paddingTop: '1rem' }}>
          {status !== 'ACTIVE' && (
            <button className="btn btn-primary btn-sm" onClick={() => doAction('APPROVE')} disabled={actionLoading}>
              {actionLoading ? <Loader2 size={15} className="spin" /> : <CheckCircle size={15} />} অনুমোদন করুন
            </button>
          )}
          {status !== 'BANNED' && (
            <button className="btn btn-outline btn-sm" onClick={() => doAction('BAN')} disabled={actionLoading} style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
              {actionLoading ? <Loader2 size={15} className="spin" /> : <Ban size={15} />} ব্যান করুন
            </button>
          )}
        </div>
      )}
    </div>
  );
}
