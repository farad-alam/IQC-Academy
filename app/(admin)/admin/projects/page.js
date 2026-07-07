'use client';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import ProjectModal from '@/components/admin/ProjectModal';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects'); // We need an admin endpoint or use public GET? 
      // Let's create/use GET /api/admin/projects or just public /api/projects.
      // Wait, is there a GET /api/admin/projects? Let's use /api/projects which already exists, wait, let's check.
      // Let's create GET /api/admin/projects if not exists, but for now let's use fetch('/api/projects'). Wait, I should make sure.
      // Let's just fetch from a new endpoint or the server component directly. Since it's client, I'll fetch from /api/admin/projects which I should create.
      const resAdmin = await fetch('/api/admin/projects');
      if (resAdmin.ok) {
        const data = await resAdmin.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই প্রজেক্টটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
      else alert('ডিলিট করতে সমস্যা হয়েছে');
    } catch {
      alert('নেটওয়ার্ক সমস্যা');
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>প্রজেক্ট ব্যবস্থাপনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>সকল সদকাহ ও চ্যারিটি প্রজেক্ট</p>
        </div>
        <ProjectModal onSuccess={fetchProjects} />
      </header>

      <div className="card" style={{ padding: '1.5rem' }}>
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
              {loading && projects.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div className="spinner spinner-sm" style={{ margin: '0 auto 1rem', borderColor: 'var(--color-primary)', borderRightColor: 'transparent' }} />
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>কোনো প্রজেক্ট পাওয়া যায়নি।</td></tr>
              ) : (
                projects.map((project) => {
                  const target = Number(project.targetAmount) || 1;
                  const raised = Number(project.raisedAmount) || 0;
                  const progress = Math.min(100, Math.round((raised / target) * 100));
                  return (
                    <tr key={project.id} style={{ borderBottom: '1px solid var(--color-earth-1)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                            {project.icon || '🎯'}
                          </div>
                          <div>
                            <div>{project.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{project.category} • {project.location}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0', fontWeight: 600 }}>৳{target.toLocaleString('bn-BD')}</td>
                      <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--color-primary)' }}>৳{raised.toLocaleString('bn-BD')}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--color-earth-2)', borderRadius: '3px', overflow: 'hidden', minWidth: '80px' }}>
                            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--color-primary)' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem' }}>{progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0' }}>
                        <span className={`badge ${project.status === 'ACTIVE' ? 'badge-success' : project.status === 'COMPLETED' ? 'badge-primary' : 'badge-earth'}`}>
                          {project.status === 'ACTIVE' ? 'চলমান' : project.status === 'COMPLETED' ? 'সম্পন্ন' : 'স্থগিত'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <ProjectModal project={project} onSuccess={fetchProjects} />
                          <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem', color: 'var(--color-error)' }} onClick={() => handleDelete(project.id)} title="মুছে ফেলুন">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
