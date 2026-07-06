import prisma from '@/lib/db';
import { Bell, Search, Plus, Edit, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminNoticesPage() {
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>নোটিশ বোর্ড ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>ওয়েবসাইটের সকল নোটিশ নিয়ন্ত্রণ</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary btn-sm"><Plus size={16} /> নতুন নোটিশ</button>
        </div>
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" className="form-input" placeholder="নোটিশ খুঁজুন..." style={{ paddingLeft: '2.5rem' }} />
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>শিরোনাম</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>প্রকাশের তারিখ</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>গুরুত্বপূর্ণ?</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 500, maxWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <Bell size={18} style={{ color: notice.isImportant ? 'var(--color-error)' : 'var(--color-primary)', marginTop: '2px' }} />
                      <div>
                        <div style={{ marginBottom: '0.25rem' }}>{notice.title}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {notice.content}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontFamily: 'var(--font-latin)', fontSize: '0.875rem' }}>
                    {new Date(notice.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {notice.isImportant ? (
                      <span className="badge badge-error">হ্যাঁ</span>
                    ) : (
                      <span className="badge badge-earth">না</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem' }} title="এডিট করুন">
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem', color: 'var(--color-error)' }} title="মুছে ফেলুন">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    কোনো নোটিশ পাওয়া যায়নি।
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
