import AdminSidebar from '@/components/layout/AdminSidebar';

// Auth is handled by middleware.js — no server-side auth check needed here.
// By the time this layout renders, the middleware has already verified the JWT.
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

