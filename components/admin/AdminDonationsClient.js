'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, BookOpen, FolderOpen, LayoutList } from 'lucide-react';
import DonationActions from '@/components/admin/DonationActions';

const STATUS_LABELS = {
  PENDING: { label: 'পেন্ডিং', className: 'badge-warning' },
  VERIFIED: { label: 'অনুমোদিত', className: 'badge-success' },
  REJECTED: { label: 'প্রত্যাখ্যাত', className: 'badge-error' },
};

const METHOD_LABELS = {
  BKASH: 'বিকাশ',
  NAGAD: 'নগদ',
  ROCKET: 'রকেট',
  BANK: 'ব্যাংক',
  OTHER: 'অন্যান্য',
};

export default function AdminDonationsClient({ initialDonations }) {
  const [donations, setDonations] = useState(initialDonations);
  const [tab, setTab] = useState('all'); // all | course | project
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  // Filter logic (client-side for speed)
  const filtered = donations.filter(d => {
    if (tab === 'course' && !d.courseId) return false;
    if (tab === 'project' && !d.projectId) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (methodFilter !== 'all' && d.method !== methodFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      const donorName = (d.name || d.user?.name || '').toLowerCase();
      const mobile = (d.mobile || '').toLowerCase();
      const txId = (d.txId || '').toLowerCase();
      const courseTitle = (d.course?.title || '').toLowerCase();
      const projectTitle = (d.project?.title || '').toLowerCase();
      if (
        !donorName.includes(s) &&
        !mobile.includes(s) &&
        !txId.includes(s) &&
        !courseTitle.includes(s) &&
        !projectTitle.includes(s)
      ) return false;
    }
    return true;
  });

  const counts = {
    all: donations.length,
    course: donations.filter(d => d.courseId).length,
    project: donations.filter(d => d.projectId).length,
    pending: donations.filter(d => d.status === 'PENDING').length,
  };

  const refreshDonations = async () => {
    const res = await fetch('/api/admin/donations?include=course,project');
    if (res.ok) {
      const data = await res.json();
      setDonations(data.donations.map(d => ({ ...d, amount: Number(d.amount) })));
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>পেমেন্ট ও অনুদান</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>কোর্স পেমেন্ট ও প্রজেক্ট অনুদান ব্যবস্থাপনা</p>
        </div>
        {counts.pending > 0 && (
          <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '10px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400e' }}>
            <Clock size={18} />
            <strong>{counts.pending}টি</strong> পেন্ডিং পেমেন্ট অনুমোদনের অপেক্ষায়
          </div>
        )}
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-earth-1)', paddingBottom: '0' }}>
        {[
          { key: 'all', label: 'সব', icon: <LayoutList size={16} />, count: counts.all },
          { key: 'course', label: 'কোর্স পেমেন্ট', icon: <BookOpen size={16} />, count: counts.course },
          { key: 'project', label: 'প্রজেক্ট অনুদান', icon: <FolderOpen size={16} />, count: counts.project },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.75rem 1.25rem', background: 'none', border: 'none',
              borderBottom: tab === t.key ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: tab === t.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: tab === t.key ? 700 : 400, cursor: 'pointer',
              fontSize: '0.9rem', whiteSpace: 'nowrap',
              marginBottom: '-1px', transition: 'color 0.15s',
            }}
          >
            {t.icon} {t.label}
            <span style={{ background: tab === t.key ? 'var(--color-primary)' : 'var(--color-earth-1)', color: tab === t.key ? 'white' : 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, padding: '1px 7px', borderRadius: '20px' }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {/* Filters Row */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="নাম, মোবাইল, TxID, কোর্স..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
            />
          </div>

          {/* Status Filter */}
          <select
            className="form-input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ fontSize: '0.875rem', minWidth: '140px' }}
          >
            <option value="all">সব স্ট্যাটাস</option>
            <option value="PENDING">⏳ পেন্ডিং</option>
            <option value="VERIFIED">✅ অনুমোদিত</option>
            <option value="REJECTED">❌ প্রত্যাখ্যাত</option>
          </select>

          {/* Method Filter */}
          <select
            className="form-input"
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            style={{ fontSize: '0.875rem', minWidth: '130px' }}
          >
            <option value="all">সব মেথড</option>
            <option value="BKASH">বিকাশ</option>
            <option value="NAGAD">নগদ</option>
            <option value="ROCKET">রকেট</option>
            <option value="BANK">ব্যাংক</option>
            <option value="OTHER">অন্যান্য</option>
          </select>

          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length}টি রেকর্ড
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-earth-1)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>দাতা / শিক্ষার্থী</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>কোর্স / প্রজেক্ট</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>পরিমাণ</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>মেথড ও TxID</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>তারিখ</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>স্ট্যাটাস</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(donation => {
                const statusInfo = STATUS_LABELS[donation.status] || { label: donation.status, className: 'badge-earth' };
                return (
                  <tr key={donation.id} style={{ borderBottom: '1px solid var(--color-earth-1)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-alt)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{donation.name || donation.user?.name || 'অজ্ঞাত'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{donation.mobile}</div>
                      {donation.user?.email && <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>{donation.user.email}</div>}
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {donation.course ? (
                        <div>
                          <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>📚 কোর্স</span>
                          <div style={{ marginTop: '4px', fontWeight: 500, fontSize: '0.85rem' }}>{donation.course.title}</div>
                        </div>
                      ) : donation.project ? (
                        <div>
                          <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>🌿 প্রজেক্ট</span>
                          <div style={{ marginTop: '4px', fontWeight: 500, fontSize: '0.85rem' }}>{donation.project.title}</div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>সাধারণ ফান্ড</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: 'var(--color-primary)', fontSize: '1rem' }}>
                      ৳{Number(donation.amount).toLocaleString('bn-BD')}
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: donation.method === 'BKASH' ? '#E2136E' : donation.method === 'NAGAD' ? '#F26922' : 'inherit' }}>
                        {METHOD_LABELS[donation.method] || donation.method}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>{donation.txId}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(donation.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                      <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>{new Date(donation.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span className={`badge ${statusInfo.className}`} style={{ whiteSpace: 'nowrap' }}>
                        {statusInfo.label}
                      </span>
                      {donation.status === 'REJECTED' && donation.rejectionReason && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-error)', marginTop: '4px', maxWidth: '120px' }} title={donation.rejectionReason}>
                          {donation.rejectionReason.substring(0, 40)}{donation.rejectionReason.length > 40 ? '...' : ''}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <DonationActions donationId={donation.id} status={donation.status} onAction={refreshDonations} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                    কোনো রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
