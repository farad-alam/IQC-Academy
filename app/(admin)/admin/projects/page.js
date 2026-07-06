import prisma from '@/lib/db';
import { Target, Search, Filter, MoreVertical, Edit, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>প্রজেক্ট ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>সকল সদকাহ ও চ্যারিটি প্রজেক্ট</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary btn-sm"><Plus size={16} /> নতুন প্রজেক্ট</button>
        </div>
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" className="form-input" placeholder="প্রজেক্ট খুঁজুন..." style={{ paddingLeft: '2.5rem' }} />
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
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>প্রজেক্টের নাম</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>লক্ষ্য (৳)</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>সংগৃহীত (৳)</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>অগ্রগতি</th>
                <th style={{ padding: '1rem 0', fontWeight: 500 }}>স্ট্যাটাস</th>
                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const target = Number(project.targetAmount) || 1;
                const raised = Number(project.raisedAmount) || 0;
                const progress = Math.min(100, Math.round((raised / target) * 100));

                return (
                  <tr key={project.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          {project.icon || '🎯'}
                        </div>
                        <div>
                          <div>{project.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{project.category} • {project.location}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0', fontFamily: 'var(--font-latin)', fontWeight: 600 }}>
                      {target.toLocaleString('bn-BD')}
                    </td>
                    <td style={{ padding: '1rem 0', fontFamily: 'var(--font-latin)', fontWeight: 600, color: 'var(--color-primary)' }}>
                      {raised.toLocaleString('bn-BD')}
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--color-earth-2)', borderRadius: '3px', overflow: 'hidden', minWidth: '80px' }}>
                          <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--color-primary)' }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-latin)' }}>{progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className={`badge ${
                        project.status === 'ACTIVE' ? 'badge-success' : 
                        project.status === 'COMPLETED' ? 'badge-primary' : 'badge-earth'
                      }`}>
                        {project.status}
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
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    কোনো প্রজেক্ট পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
