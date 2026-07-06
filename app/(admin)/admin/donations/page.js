import prisma from '@/lib/db';
import { Heart, Search, Filter, MoreVertical, CheckCircle, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDonationsPage() {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
      project: { select: { title: true } }
    }
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>সদকাহ ও প্রজেক্ট ফান্ডিং</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>সকল অনুদান ও ট্রানজেকশন তালিকা</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary btn-sm">নতুন প্রজেক্ট তৈরি করুন</button>
        </div>
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" className="form-input" placeholder="ট্রানজেকশন আইডি বা মোবাইল..." style={{ paddingLeft: '2.5rem' }} />
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            </div>
            <button className="btn btn-outline" style={{ padding: '0 1rem' }}>
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>দাতা</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>প্রজেক্ট</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>পরিমাণ</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>মেথড ও TxID</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>তারিখ</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>স্ট্যাটাস</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 500 }}>
                    <div>{donation.name || donation.user?.name || 'অজ্ঞাত'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-latin)' }}>{donation.mobile}</div>
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)' }}>
                    {donation.project?.title || 'সাধারণ ফান্ড'}
                  </td>
                  <td style={{ padding: '1rem 0', fontFamily: 'var(--font-latin)', fontWeight: 600, color: 'var(--color-primary)' }}>
                    ৳ {donation.amount?.toString()}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{donation.method}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-latin)' }}>{donation.txId}</div>
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontFamily: 'var(--font-latin)', fontSize: '0.875rem' }}>
                    {new Date(donation.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <span className={`badge ${
                      donation.status === 'VERIFIED' ? 'badge-success' : 
                      donation.status === 'PENDING' ? 'badge-warning' : 'badge-error'
                    }`}>
                      {donation.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    {donation.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem', color: 'var(--color-success)' }} title="অনুমোদন করুন">
                          <CheckCircle size={18} />
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem', color: 'var(--color-error)' }} title="বাতিল করুন">
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    কোনো অনুদান পাওয়া যায়নি।
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
