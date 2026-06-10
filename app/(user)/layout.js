import TopNav from '@/components/layout/TopNav';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';

export default function UserLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <TopNav />
      <main className="page-content" style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
