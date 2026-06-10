import { Users, BookOpen, Gift, Layers, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'মোট শিক্ষার্থী', value: '১,২৫০', icon: Users, color: 'var(--color-primary)' },
    { title: 'মোট কোর্স', value: '১২', icon: BookOpen, color: 'var(--color-accent-dark)' },
    { title: 'মোট ডোনেশন', value: '৳ ৪৫,০০০', icon: Gift, color: 'var(--color-success)' },
    { title: 'সক্রিয় ব্যাচ', value: '৫', icon: Layers, color: 'var(--color-warning)' },
  ];

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>ড্যাশবোর্ড ওভারভিউ</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>IQC Academy এর সকল কার্যক্রমের সারসংক্ষেপ</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline btn-sm">রিপোর্ট ডাউনলোড</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{stat.title}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-latin)' }}>{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Activity */}
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
                {[
                  { name: 'আব্দুল্লাহ', email: 'abdullah@example.com', date: '১০ জুন, ২০২৬', status: 'Active' },
                  { name: 'উমর', email: 'umar@example.com', date: '০৯ জুন, ২০২৬', status: 'Active' },
                  { name: 'ফাতিমা', email: 'fatima@example.com', date: '০৯ জুন, ২০২৬', status: 'Pending' },
                  { name: 'আলী', email: 'ali@example.com', date: '০৮ জুন, ২০২৬', status: 'Active' }
                ].map((user, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 500 }}>{user.name}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)' }}>{user.email}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontFamily: 'var(--font-latin)', fontSize: '0.875rem' }}>{user.date}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
            {[
              { id: 'TXN8392J', amount: 500, method: 'bKash' },
              { id: 'TXN9123K', amount: 1000, method: 'Nagad' },
              { id: 'TXN1029L', amount: 200, method: 'bKash' }
            ].map((donation, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-earth-1)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-latin)' }}>৳{donation.amount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-latin)' }}>
                    {donation.method} • {donation.id}
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>যাচাই করুন</button>
              </div>
            ))}
          </div>
          
          <button className="btn btn-ghost w-full" style={{ marginTop: '1rem' }}>সব দেখুন</button>
        </div>
      </div>
    </div>
  );
}
