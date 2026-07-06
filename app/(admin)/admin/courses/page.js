import prisma from '@/lib/db';
import { BookOpen, Search, Plus, Edit, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { enrollments: true, modules: true }
      }
    }
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>কোর্স ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>সকল কোর্সের তালিকা ও নিয়ন্ত্রণ</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} /> নতুন কোর্স
        </button>
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', maxWidth: '400px', flex: 1 }}>
            <input type="text" className="form-input" placeholder="কোর্স খুঁজুন..." style={{ paddingLeft: '2.5rem' }} />
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>কোর্সের নাম</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>শিক্ষক</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>মূল্য</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>মডিউল সংখ্যা</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>শিক্ষার্থী সংখ্যা</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>স্ট্যাটাস</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{course.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{course.level}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0' }}>{course.instructor}</td>
                  <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--color-primary)' }}>
                    {course.price > 0 ? `৳${course.price}` : 'ফ্রি'}
                  </td>
                  <td style={{ padding: '1rem 0' }}>{course._count.modules} টি</td>
                  <td style={{ padding: '1rem 0' }}>{course._count.enrollments} জন</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span className={`badge ${course.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem' }} title="এডিট করুন">
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem', color: 'var(--color-error)' }} title="মুছে ফেলুন">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো কোর্স পাওয়া যায়নি।</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
