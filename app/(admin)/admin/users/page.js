import prisma from '@/lib/db';
import { Users, Search, Filter, MoreVertical } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { enrollments: true }
      }
    }
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>ব্যবহারকারী ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>সকল নিবন্ধিত শিক্ষার্থীর তালিকা ও তথ্য</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary btn-sm">নতুন ব্যবহারকারী যোগ করুন</button>
        </div>
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" className="form-input" placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..." style={{ paddingLeft: '2.5rem' }} />
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
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>নাম</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>যোগাযোগ</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>যোগদানের তারিখ</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>কোর্স এনরোলমেন্ট</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>স্ট্যাটাস</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: #{user.id.substring(user.id.length - 4)}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ fontSize: '0.875rem', fontFamily: 'var(--font-latin)' }}>{user.mobile}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontFamily: 'var(--font-latin)', fontSize: '0.875rem' }}>
                    {new Date(user.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '1rem 0', fontFamily: 'var(--font-latin)' }}>{user._count?.enrollments || 0}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span className={`badge ${
                      user.status === 'ACTIVE' ? 'badge-success' : 
                      user.status === 'PENDING' ? 'badge-warning' : 'badge-earth'
                    }`}>
                      {user.status === 'ACTIVE' ? 'Active' : user.status === 'PENDING' ? 'Pending' : 'Banned'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem' }}>
                      <MoreVertical size={18} color="var(--color-text-muted)" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    কোনো ব্যবহারকারী পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          <span>সর্বমোট {users.length.toLocaleString('bn-BD')} জন ব্যবহারকারী</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline btn-sm" disabled>পূর্ববর্তী</button>
            <button className="btn btn-outline btn-sm" disabled>পরবর্তী</button>
          </div>
        </div>
      </div>
    </div>
  );
}
