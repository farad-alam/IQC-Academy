'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteNoticeButton({ noticeId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/notices/${noticeId}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'কোনো সমস্যা হয়েছে।');
      } else {
        router.refresh();
      }
    } catch {
      alert('নেটওয়ার্ক সমস্যা।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-ghost btn-sm"
      style={{ padding: '0.5rem', color: 'var(--color-error)' }}
      onClick={handleDelete}
      disabled={loading}
      title="মুছে ফেলুন"
    >
      <Trash2 size={16} />
    </button>
  );
}
