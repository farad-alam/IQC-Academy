import prisma from '@/lib/db';
import CreateNoticeModal from '@/components/admin/CreateNoticeModal';
import NoticesClient from './NoticesClient';

export const dynamic = 'force-dynamic';

export default async function AdminNoticesPage() {
  const notices = await prisma.notice.findMany({
    orderBy: { order: 'desc' }
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

      <NoticesClient initialNotices={notices} />
    </div>
  );
}
