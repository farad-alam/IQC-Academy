'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, GripVertical, Edit2 } from 'lucide-react';
import DeleteNoticeButton from '@/components/admin/DeleteNoticeButton';
import CreateNoticeModal from '@/components/admin/CreateNoticeModal';

export default function NoticesClient({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex === dropIndex) return;

    const newNotices = [...notices];
    const [draggedItem] = newNotices.splice(dragIndex, 1);
    newNotices.splice(dropIndex, 0, draggedItem);

    // Update local state immediately
    setNotices(newNotices);

    // Prepare payload for backend
    const payload = newNotices.map((n, i) => ({ id: n.id, order: newNotices.length - i }));

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/notices/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to reorder');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('নোটিশ রিঅর্ডার করতে সমস্যা হয়েছে।');
      setNotices(initialNotices); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem', position: 'relative' }}>
      {isSaving && (
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.875rem', color: 'var(--color-primary)' }}>
          সেভ হচ্ছে...
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <th style={{ padding: '1rem 0', width: '40px' }}></th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>শিরোনাম ও বিবরণ</th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>প্রকাশের তারিখ</th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>গুরুত্বপূর্ণ?</th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>মেয়াদ শেষ</th>
              <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice, index) => (
              <tr
                key={notice.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                style={{ borderBottom: '1px solid var(--color-earth-1)', cursor: 'move', backgroundColor: 'var(--color-bg)' }}
              >
                <td style={{ padding: '1rem 0' }}>
                  <GripVertical size={16} style={{ color: 'var(--color-text-muted)', cursor: 'grab' }} />
                </td>
                <td style={{ padding: '1rem 0', maxWidth: '350px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Bell size={18} style={{ color: notice.important ? 'var(--color-error)' : 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{notice.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                        {notice.body}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  {new Date(notice.publishedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td style={{ padding: '1rem 0' }}>
                  {notice.important
                    ? <span className="badge badge-error">হ্যাঁ</span>
                    : <span className="badge badge-earth">না</span>
                  }
                </td>
                <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  {notice.expiresAt
                    ? new Date(notice.expiresAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })
                    : '—'
                  }
                </td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <CreateNoticeModal 
                      notice={notice} 
                      trigger={
                        <button className="btn btn-ghost btn-sm" style={{ padding: '0.25rem' }} title="এডিট করুন">
                          <Edit2 size={16} />
                        </button>
                      } 
                    />
                    <DeleteNoticeButton noticeId={notice.id} />
                  </div>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো নোটিশ পাওয়া যায়নি।</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
