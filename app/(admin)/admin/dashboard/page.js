import prisma from '@/lib/db';
import { Users, BookOpen, Gift, TrendingUp, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalCourses,
    totalDonationsAgg,
    pendingDonationsCount,
    recentUsers,
    pendingDonations,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.donation.aggregate({ where: { status: 'VERIFIED' }, _sum: { amount: true } }),
    prisma.donation.count({ where: { status: 'PENDING' } }),
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, status: true, createdAt: true }
    }),
    prisma.donation.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { project: { select: { title: true } } }
    }),
  ]);

  const totalDonations = Number(totalDonationsAgg._sum.amount) || 0;

  const stats = [
    { title: 'মোট শিক্ষার্থী', value: totalUsers.toLocaleString('bn-BD'), icon: Users, color: 'var(--color-primary)' },
    { title: 'প্রকাশিত কোর্স', value: totalCourses.toLocaleString('bn-BD'), icon: BookOpen, color: 'var(--color-accent-dark)' },
    { title: 'মোট সংগ্রহ (৳)', value: `৳${totalDonations.toLocaleString('bn-BD')}`, icon: Gift, color: 'var(--color-success)' },
    { title: 'অপেক্ষমাণ ডোনেশন', value: pendingDonationsCount.toLocaleString('bn-BD'), icon: Clock, color: 'var(--color-warning)' },
  ];

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>ড্যাশবোর্ড ওভারভিউ</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>IQC Academy এর সকল কার্যক্রমের সারসংক্ষেপ</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{stat.title}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Registrations */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="var(--color-primary)" /> সাম্প্রতিক রেজিস্ট্রেশন
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem 0', fontWeight: 500 }}>নাম</th>
                  <th style={{ padding: '1rem 0', fontWeight: 500 }}>ইমেইল</th>
                  <th style={{ padding: '1rem 0', fontWeight: 500 }}>তারিখ</th>
                  <th style={{ padding: '1rem 0', fontWeight: 500 }}>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : u.status === 'PENDING' ? 'badge-warning' : 'badge-earth'}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো শিক্ষার্থী নেই</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Donations */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gift size={20} color="var(--color-accent-dark)" /> অপেক্ষমাণ ডোনেশন
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingDonations.map((d) => (
              <div key={d.id} style={{ padding: '1rem', border: '1px solid var(--color-earth-1)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>৳{Number(d.amount).toLocaleString('bn-BD')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{d.method} • {d.txId}</div>
                  {d.project && <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{d.project.title}</div>}
                </div>
                <a href="/admin/donations" className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                  যাচাই করুন
                </a>
              </div>
            ))}
            {pendingDonations.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '1rem' }}>কোনো অপেক্ষমাণ ডোনেশন নেই</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
