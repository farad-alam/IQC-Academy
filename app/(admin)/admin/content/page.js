import { BookOpen, Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { mockContents } from '@/lib/mockData';

export default function AdminContentPage() {
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>কন্টেন্ট ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>আর্টিকেল, পিডিএফ এবং ভিডিও কন্টেন্ট যোগ করুন ও সম্পাদনা করুন</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> নতুন কন্টেন্ট
          </button>
        </div>
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" className="form-input" placeholder="কন্টেন্ট খুঁজুন..." style={{ paddingLeft: '2.5rem' }} />
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            </div>
            <button className="btn btn-outline" style={{ padding: '0 1rem' }}>
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>শিরোনাম</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>ধরন</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>অধ্যয়নের সময়</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>ট্যাগসমূহ</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {mockContents.map((content) => (
                <tr key={content.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{content.title}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <span className={`badge ${content.type === 'text' ? 'badge-primary' : content.type === 'video' ? 'badge-info' : 'badge-accent'}`}>
                      {content.type === 'text' ? 'আর্টিকেল' : content.type === 'video' ? 'ভিডিও' : 'পিডিএফ'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontFamily: 'var(--font-latin)', fontSize: '0.875rem' }}>
                    {content.readingTime}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {content.tags.map((tag, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-alt)', padding: '2px 6px', borderRadius: '4px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" style={{ padding: '0.5rem', color: 'var(--color-primary)' }}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-outline btn-sm" style={{ padding: '0.5rem', color: 'var(--color-error)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
