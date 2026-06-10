'use client';
import Link from 'next/link';
import { BookOpen, Award, CheckCircle2, Lock } from 'lucide-react';
import { mockMadrasaPrograms } from '@/lib/mockData';

export default function MadrasaPage() {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem' }}>
          🕌
        </div>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>অনলাইন মাদ্রাসা</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          আলেমদের তত্ত্বাবধানে ধাপে ধাপে কুরআন ও ইসলামিক জ্ঞান অর্জন করুন। প্রতিটি লেভেল শেষ করে সার্টিফিকেট গ্রহণ করুন।
        </p>
      </header>

      <div className="grid-2 gap-6" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {mockMadrasaPrograms.map((program) => {
          const isLocked = program.status === 'locked';
          const isEnrolled = program.status === 'enrolled';

          return (
            <div key={program.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              {isLocked && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--color-text-light)' }}>
                  <Lock size={20} />
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className={`badge ${isLocked ? 'badge-earth' : 'badge-primary'}`}>
                  {program.level}
                </span>
                <span className="badge badge-earth">{program.duration}</span>
              </div>
              
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: isLocked ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
                {program.title}
              </h2>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={16} /> মোট মডিউল: {program.modules}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} /> সার্টিফিকেট প্রদান করা হবে
                </li>
              </ul>

              <div style={{ marginTop: 'auto' }}>
                {isEnrolled ? (
                  <div style={{ backgroundColor: 'var(--color-primary-50)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                      <span style={{ color: 'var(--color-primary-dark)' }}>অগ্রগতি</span>
                      <span style={{ color: 'var(--color-primary)' }}>{program.progress}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${program.progress}%` }} />
                    </div>
                    <Link href={`/madrasa/${program.id}`} className="btn btn-primary w-full" style={{ marginTop: '1rem' }}>
                      চালিয়ে যান
                    </Link>
                  </div>
                ) : isLocked ? (
                  <button className="btn btn-outline w-full" disabled style={{ opacity: 0.5 }}>
                    পরবর্তী লেভেল
                  </button>
                ) : (
                  <Link href={`/madrasa/${program.id}/enroll`} className="btn btn-primary w-full">
                    ভর্তি হোন
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
