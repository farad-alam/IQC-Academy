import { mockGallery } from '@/lib/mockData';

export default function GalleryPage() {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>গ্যালারি</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          IQC Academy-এর বিভিন্ন ইভেন্ট ও কার্যক্রমের স্থিরচিত্র।
        </p>
      </header>

      <div className="grid-3 gap-6">
        {mockGallery.map((item) => (
          <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
            <div style={{ aspectRatio: '4/3', backgroundColor: 'var(--color-surface-alt)', position: 'relative' }}>
              {/* Placeholder for images */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.2 }}>
                📷
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-earth">{item.type === 'event' ? 'ইভেন্ট' : 'ক্লাস'}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-latin)' }}>{item.date}</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
