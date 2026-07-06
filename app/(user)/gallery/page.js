import prisma from '@/lib/db';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const galleryItems = await prisma.galleryItem.findMany({
    orderBy: { date: 'desc' }
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>গ্যালারি</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          IQC Academy-এর বিভিন্ন ইভেন্ট ও কার্যক্রমের স্থিরচিত্র।
        </p>
      </header>

      <div className="grid-3 gap-6">
        {galleryItems.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-muted)' }}>গ্যালারিতে কোনো ছবি নেই।</p>
        ) : galleryItems.map((item) => (
          <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
            <div style={{ aspectRatio: '4/3', backgroundColor: 'var(--color-surface-alt)', position: 'relative' }}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.2 }}>
                  📷
                </div>
              )}
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-earth">
                  {item.type === 'event' ? 'ইভেন্ট' : item.type === 'class' ? 'ক্লাস' : 'প্রজেক্ট'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-latin)' }}>
                  {new Date(item.date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
