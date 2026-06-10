import { mockProjects } from '@/lib/mockData';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>আমাদের প্রজেক্টসমূহ</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          IQC Academy-এর বিভিন্ন দ্বীনি ও সামাজিক প্রজেক্টে অংশগ্রহণ করুন।
        </p>
      </header>

      <div className="grid-2 gap-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {mockProjects.map(project => (
          <div key={project.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{project.icon}</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.title}</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', flex: 1 }}>{project.description}</p>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--color-primary-dark)' }}>সংগ্রহ: ৳{project.raised.toLocaleString('bn-BD')}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>লক্ষ্য: ৳{project.target.toLocaleString('bn-BD')}</span>
              </div>
              <div className="progress-bar-track" style={{ marginBottom: '1rem' }}>
                <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', fontFamily: 'var(--font-latin)' }}>
                {project.progress}% সম্পূর্ণ
              </div>
              
              <Link href="/donate" className="btn btn-primary w-full">
                ডোনেট করুন
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
