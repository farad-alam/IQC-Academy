'use client';
import { useState, useEffect, useCallback } from 'react';
import { Shield, UserPlus, UserMinus, Search, AlertTriangle, Loader2, Crown } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminManagePage() {
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [demoting, setDemoting] = useState('');

  // Check current user's role
  useEffect(() => {
    fetch('/api/users/me').then(r => r.json()).then(d => {
      if (d.success) setCurrentUserRole(d.profile.role);
    });
  }, []);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users?role=ADMIN');
    if (res.ok) {
      const data = await res.json();
      setAdmins(data.users || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    setSearching(true);
    setSearchResult(null);
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(searchEmail)}`);
    if (res.ok) {
      const data = await res.json();
      const found = data.users?.find(u => u.email.toLowerCase() === searchEmail.toLowerCase().trim());
      setSearchResult(found || null);
      if (!found) toast.error('এই ইমেইলে কোনো ব্যবহারকারী পাওয়া যায়নি।');
    }
    setSearching(false);
  };

  const handlePromote = async () => {
    if (!searchResult) return;
    setPromoting(true);
    const res = await fetch(`/api/admin/users/${searchResult.id}/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'PROMOTE_TO_ADMIN' })
    });
    if (res.ok) {
      toast.success(`${searchResult.name} কে অ্যাডমিন করা হয়েছে।`);
      setSearchResult(null);
      setSearchEmail('');
      fetchAdmins();
    } else {
      const d = await res.json();
      toast.error(d.error || 'ব্যর্থ হয়েছে।');
    }
    setPromoting(false);
  };

  const handleDemote = async (userId, userName) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${userName}" কে অ্যাডমিন থেকে সরাতে চান?`)) return;
    setDemoting(userId);
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DEMOTE_TO_STUDENT' })
    });
    if (res.ok) {
      toast.success(`${userName} কে অ্যাডমিন থেকে সরানো হয়েছে।`);
      fetchAdmins();
    } else {
      const d = await res.json();
      toast.error(d.error || 'ব্যর্থ হয়েছে।');
    }
    setDemoting('');
  };

  // Access denied for non-super-admin
  if (currentUserRole && currentUserRole !== 'SUPER_ADMIN') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-error)' }}>অ্যাক্সেস নেই</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>এই পেজটি শুধুমাত্র সুপার এডমিনের জন্য।</p>
      </div>
    );
  }

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Crown size={22} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>এডমিন ব্যবস্থাপনা</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>নতুন এডমিন যোগ করুন এবং বিদ্যমান এডমিনদের পরিচালনা করুন।</p>
        <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-primary-50)', color: 'var(--color-primary)', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
          <Shield size={14} /> সুপার এডমিন একমাত্র এই পেজ দেখতে পারেন
        </div>
      </header>

      {/* Add Admin Section */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={18} color="var(--color-primary)" /> নতুন এডমিন যোগ করুন
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="email"
              className="form-input"
              placeholder="শিক্ষার্থীর ইমেইল দিয়ে খুঁজুন..."
              style={{ paddingLeft: '2.25rem' }}
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-outline" disabled={searching || !searchEmail.trim()}>
            {searching ? <Loader2 size={16} className="spin" /> : <Search size={16} />} খুঁজুন
          </button>
        </form>

        {/* Search Result */}
        {searchResult && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: 'var(--color-surface-alt)', border: '1px solid var(--color-earth-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>
                {searchResult.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{searchResult.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{searchResult.email}</div>
                <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>
                  <span className={`badge ${searchResult.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>{searchResult.status}</span>
                  {' '}<span style={{ color: 'var(--color-text-muted)' }}>· বর্তমান ভূমিকা: {searchResult.role}</span>
                </div>
              </div>
            </div>
            {searchResult.role === 'ADMIN' || searchResult.role === 'SUPER_ADMIN' ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} /> ইতিমধ্যে এডমিন
              </div>
            ) : (
              <button onClick={handlePromote} className="btn btn-primary" disabled={promoting}>
                {promoting ? <Loader2 size={16} className="spin" /> : <Crown size={16} />}
                অ্যাডমিন করুন
              </button>
            )}
          </div>
        )}
      </div>

      {/* Current Admins List */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} color="var(--color-primary)" /> বর্তমান এডমিনগণ ({admins.length} জন)
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            <Loader2 size={24} className="spin" style={{ margin: '0 auto' }} />
          </div>
        ) : admins.length === 0 ? (
          <div className="empty-state"><Shield size={32} /><p>কোনো এডমিন নেই।</p></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-earth-1)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>নাম</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>ইমেইল</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>মোবাইল</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                  <td style={{ padding: '0.9rem 0', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      {admin.name}
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{admin.email}</td>
                  <td style={{ padding: '0.9rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{admin.mobile}</td>
                  <td style={{ padding: '0.9rem 0', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDemote(admin.id, admin.name)}
                      disabled={demoting === admin.id}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-error)' }}
                    >
                      {demoting === admin.id ? <Loader2 size={14} className="spin" /> : <UserMinus size={14} />}
                      সরিয়ে দিন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
