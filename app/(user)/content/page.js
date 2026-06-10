import ContentCard from '@/components/features/ContentCard';
import { mockContents } from '@/lib/mockData';

export default function ContentListPage() {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">কন্টেন্ট সমূহ</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          ইসলামিক প্রবন্ধ, বই ও ভিডিও কন্টেন্ট পড়ুন এবং আপনার জ্ঞান বৃদ্ধি করুন।
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom: '2rem', maxWidth: '400px' }}>
        <button className="tab active">সকল</button>
        <button className="tab">আর্টিকেল</button>
        <button className="tab">পিডিএফ</button>
        <button className="tab">ভিডিও</button>
      </div>

      <div className="grid-3 gap-6">
        {mockContents.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    </div>
  );
}
