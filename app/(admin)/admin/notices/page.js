import prisma from '@/lib/db';
import { Bell, Trash2 } from 'lucide-react';
import CreateNoticeModal from '@/components/admin/CreateNoticeModal';
import DeleteNoticeButton from '@/components/admin/DeleteNoticeButton';

export const dynamic = 'force-dynamic';

export default async function AdminNoticesPage() {
  const notices = await prisma.notice.findMany({
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>নোটিশ বোর্ড ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>ওয়েবসাইটের সকল নোটিশ নিয়ন্ত্রণ</p>
        </div>
        <CreateNoticeModal />
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>শিরোনাম ও বিবরণ</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>প্রকাশের তারিখ</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>গুরুত্বপূর্ণ?</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>মেয়াদ শেষ</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                  <td style={{ padding: '1rem 0', maxWidth: '350px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <Bell size={18} style={{ color: notice.important ? 'var(--color-error)' : 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{notice.title}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                          {notice.body}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {new Date(notice.publishedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {notice.important
                      ? <span className="badge badge-error">হ্যাঁ</span>
                      : <span className="badge badge-earth">না</span>
                    }
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {notice.expiresAt
                      ? new Date(notice.expiresAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '—'
                    }
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <DeleteNoticeButton noticeId={notice.id} />
                  </td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো নোটিশ পাওয়া যায়নি।</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
