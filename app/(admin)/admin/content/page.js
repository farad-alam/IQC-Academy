'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Search, Edit, Trash2 } from 'lucide-react';
import CreateContentModal from '@/components/admin/CreateContentModal';

export default function AdminContentPage() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setContents(data.content || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই কন্টেন্ট মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
      if (res.ok) fetchContent();
      else alert('ডিলিট করতে সমস্যা হয়েছে');
    } catch {
      alert('নেটওয়ার্ক সমস্যা');
    }
  };

  const filteredContents = contents.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>কন্টেন্ট ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>আর্টিকেল, পিডিএফ এবং ভিডিও কন্টেন্ট যোগ করুন ও সম্পাদনা করুন</p>
        </div>
        <CreateContentModal onContentCreated={fetchContent} />
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="কন্টেন্ট খুঁজুন..." 
                style={{ paddingLeft: '2.5rem' }} 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            </div>
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
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>স্ট্যাটাস</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredContents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div className="spinner spinner-sm" style={{ margin: '0 auto 1rem', borderColor: 'var(--color-primary)', borderRightColor: 'transparent' }} />
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredContents.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো কন্টেন্ট পাওয়া যায়নি।</td></tr>
              ) : (
                filteredContents.map((content) => (
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
                      <span className={`badge ${content.type === 'ARTICLE' ? 'badge-primary' : content.type === 'VIDEO' ? 'badge-info' : 'badge-accent'}`}>
                        {content.type === 'ARTICLE' ? 'আর্টিকেল' : content.type === 'VIDEO' ? 'ভিডিও' : 'পিডিএফ'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontFamily: 'var(--font-latin)', fontSize: '0.875rem' }}>
                      {content.readingTime || '-'}
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
                    <td style={{ padding: '1rem 0' }}>
                      <span className={`badge ${content.published ? 'badge-success' : 'badge-warning'}`}>
                        {content.published ? 'প্রকাশিত' : 'ড্রাফট'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem', color: 'var(--color-error)' }} onClick={() => handleDelete(content.id)} title="মুছে ফেলুন">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
