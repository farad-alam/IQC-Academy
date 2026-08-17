import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/middleware/withAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default async function AdminLayout({ children }) {
  const user = await getAuthUser();

  // Redirect anyone who isn't a logged-in ADMIN or SUPER_ADMIN
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

