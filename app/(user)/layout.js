import TopNav from '@/components/layout/TopNav';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import { getSiteSettings } from '@/lib/siteSettings';

export default async function UserLayout({ children }) {
  const settings = await getSiteSettings(['individual_registration_open']);
  const isRegistrationOpen = settings.individual_registration_open !== 'false';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <TopNav initialRegistrationOpen={isRegistrationOpen} />
      <main className="page-content" style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
