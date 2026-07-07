'use client';

import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import UserActionsMenu from '@/components/admin/UserActionsMenu';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Refresh interval
    const intervalId = setInterval(fetchUsers, 30000); // 30 sec polling
    return () => clearInterval(intervalId);
  }, []);

  const pendingCount = users.filter((u) => u.status === 'PENDING').length;

  const filteredUsers = users.filter((u) => {
    // Tab filter
    if (activeTab !== 'ALL' && u.status !== activeTab) return false;
    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.mobile.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>ব্যবহারকারী ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>সকল নিবন্ধিত শিক্ষার্থীর তালিকা ও তথ্য</p>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-earth-1)' }}>
        <button
          onClick={() => setActiveTab('ALL')}
          style={{
            padding: '0.75rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'ALL' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === 'ALL' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'ALL' ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          সব ব্যবহারকারী
        </button>
        <button
          onClick={() => setActiveTab('PENDING')}
          style={{
            padding: '0.75rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'PENDING' ? '2px solid var(--color-warning)' : '2px solid transparent',
            color: activeTab === 'PENDING' ? 'var(--color-warning)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'PENDING' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          অপেক্ষমাণ
          {pendingCount > 0 && (
            <span style={{
              background: 'var(--color-error)',
              color: 'white',
              fontSize: '0.7rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '50px',
              fontWeight: 700
            }}>
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('ACTIVE')}
          style={{
            padding: '0.75rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'ACTIVE' ? '2px solid var(--color-success)' : '2px solid transparent',
            color: activeTab === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'ACTIVE' ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          সক্রিয়
        </button>
        <button
          onClick={() => setActiveTab('BANNED')}
          style={{
            padding: '0.75rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'BANNED' ? '2px solid var(--color-error)' : '2px solid transparent',
            color: activeTab === 'BANNED' ? 'var(--color-error)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'BANNED' ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          ব্যান করা
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="নাম, ইমেইল বা মোবাইল নম্বর দিয়ে খুঁজুন..."
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
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
              {loading && filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div className="spinner spinner-sm" style={{ margin: '0 auto 1rem', borderColor: 'var(--color-primary)', borderRightColor: 'transparent' }} />
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো ব্যবহারকারী পাওয়া যায়নি।</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {user.role === 'ADMIN' ? '👑 Admin' : 'Student'} • #{user.id.substring(user.id.length - 6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ fontSize: '0.875rem' }}>{user.mobile}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      {new Date(user.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '1rem 0' }}>{user._count?.enrollments || 0}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className={`badge ${user.status === 'ACTIVE' ? 'badge-success' : user.status === 'PENDING' ? 'badge-warning' : 'badge-earth'}`}>
                        {user.status === 'PENDING' ? 'অপেক্ষমাণ' : user.status === 'ACTIVE' ? 'সক্রিয়' : 'ব্যান করা'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                      {user.role !== 'ADMIN' && (
                        <UserActionsMenu
                          userId={user.id}
                          currentStatus={user.status}
                          onUpdate={fetchUsers}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          <span>সর্বমোট {filteredUsers.length} জন ব্যবহারকারী দেখাচ্ছে</span>
        </div>
      </div>
    </div>
  );
}
