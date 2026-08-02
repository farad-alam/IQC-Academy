import { AlertTriangle, Clock } from 'lucide-react';

export const metadata = {
  title: 'মেইনটেন্যান্স | IQC Academy',
};

export default function MaintenancePage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface)', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <AlertTriangle size={48} />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text)' }}>
          সাইটটি রক্ষণাবেক্ষণে আছে
        </h1>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
          উন্নত সেবার লক্ষ্যে বর্তমানে আমাদের ওয়েবসাইটের আপডেট কাজ চলছে। সাময়িক এই অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত। খুব শীঘ্রই আমরা ফিরে আসবো ইনশাআল্লাহ।
        </p>

        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface-alt)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Clock size={18} /> জরুরী প্রয়োজনে যোগাযোগ করুন
          </h3>
          <p style={{ color: 'var(--color-text-muted)' }}>+880 1700 000000</p>
          <p style={{ color: 'var(--color-text-muted)' }}>info@iqcacademy.com</p>
        </div>
      </div>
    </div>
  );
}
