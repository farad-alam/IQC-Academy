'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Lock, ShieldCheck } from 'lucide-react';
import { mockCourses } from '@/lib/mockData';

export default function CourseEnrollmentPage({ params }) {
  const { id } = use(params);
  const course = mockCourses.find(c => c.id === parseInt(id)) || mockCourses[0];
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    // Simulate API
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    window.location.href = `/courses/${course.id}`;
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
      <Link href={`/courses/${course.id}`} className="btn btn-ghost" style={{ padding: 0, marginBottom: '2rem' }}>
        <ChevronLeft size={20} /> কোর্সে ফিরে যান
      </Link>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>কোর্সে ভর্তি হোন</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{course.title}</p>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-alt)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--color-earth-2)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>কোর্স ফি</span>
            <span style={{ fontWeight: 600 }}>৳ {course.price || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--color-earth-2)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>ডিসকাউন্ট</span>
            <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>- ৳ 0</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            <span>সর্বমোট প্রদেয়</span>
            <span style={{ fontFamily: 'var(--font-latin)' }}>৳ {course.price || 0}</span>
          </div>
        </div>

        {course.type === 'paid' ? (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>পেমেন্ট পদ্ধতি নির্বাচন করুন</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', height: 'auto' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E2136E' }}>bKash</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>বিকাশ পেমেন্ট</span>
              </button>
              <button className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', height: 'auto' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F26922' }}>Nagad</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>নগদ পেমেন্ট</span>
              </button>
            </div>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--color-warning-bg)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
               <ShieldCheck size={18} color="var(--color-accent-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
               <span>পেমেন্ট সম্পন্ন হওয়ার পর আপনার এনরোলমেন্ট স্বয়ংক্রিয়ভাবে একটিভ হয়ে যাবে।</span>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--color-success)', fontWeight: 600 }}>
             এই কোর্সটি সম্পূর্ণ ফ্রি!
          </div>
        )}

        <button 
          onClick={handleEnroll} 
          className={`btn ${course.type === 'paid' ? 'btn-accent' : 'btn-primary'} w-full`} 
          style={{ padding: '1rem' }}
          disabled={loading}
        >
          {loading ? <><span className="spinner spinner-sm" /> প্রসেস হচ্ছে...</> : (course.type === 'paid' ? 'পেমেন্ট করুন ও ভর্তি হোন' : 'ফ্রি ভর্তি হোন')}
        </button>
      </div>
    </div>
  );
}
