'use client';
import { useState } from 'react';
import CourseCard from '@/components/features/CourseCard';
import { mockCourses } from '@/lib/mockData';

export default function CourseListPage() {
  const [filter, setFilter] = useState('all');

  const filteredCourses = mockCourses.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'enrolled') return c.status === 'enrolled' || c.status === 'completed';
    if (filter === 'paid') return c.type === 'paid';
    return true;
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">কোর্সসমূহ</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          আপনার পছন্দমতো কোর্স নির্বাচন করে ধাপে ধাপে শেখা শুরু করুন।
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom: '2rem', maxWidth: '400px' }}>
        <button 
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          সকল কোর্স
        </button>
        <button 
          className={`tab ${filter === 'enrolled' ? 'active' : ''}`}
          onClick={() => setFilter('enrolled')}
        >
          আমার কোর্স
        </button>
        <button 
          className={`tab ${filter === 'paid' ? 'active' : ''}`}
          onClick={() => setFilter('paid')}
        >
          প্রিমিয়াম
        </button>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <h3>কোনো কোর্স পাওয়া যায়নি</h3>
          <p>এই মুহূর্তে এই বিভাগে কোনো কোর্স নেই।</p>
        </div>
      )}
    </div>
  );
}
