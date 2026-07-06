import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/middleware/withAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default async function AdminLayout({ children }) {
  const user = await getAuthUser();

  // Redirect anyone who isn't a logged-in ADMIN
  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

