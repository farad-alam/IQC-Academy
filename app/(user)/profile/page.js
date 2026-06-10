'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Settings, LogOut, Award, BookOpen, User as UserIcon, Calendar, Edit3 } from 'lucide-react';
import { mockUser, mockAchievements } from '@/lib/mockData';
import styles from './profile.module.css';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      
      {/* Header Profile Info */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div className={styles.headerBg} aria-hidden="true" />
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div className={styles.avatarContainer}>
            {mockUser.avatar ? (
              <img src={mockUser.avatar} alt={mockUser.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {mockUser.name.charAt(0)}
              </div>
            )}
            <button className={styles.editAvatarBtn} aria-label="Edit Avatar">
              <Edit3 size={16} />
            </button>
          </div>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-primary-dark)' }}>
              {mockUser.name}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserIcon size={16} /> {mockUser.id}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">পয়েন্ট: {mockUser.totalPoints}</span>
              <span className="badge badge-accent">স্ট্রিক: {mockUser.currentStreak} দিন</span>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Link href="/profile/edit" className="btn btn-outline btn-sm">
              <Settings size={16} /> সেটিংস
            </Link>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }}>
              <LogOut size={16} /> লগআউট
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '2rem' }}>
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          ওভারভিউ
        </button>
        <button 
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          অর্জনসমূহ
        </button>
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          ব্যক্তিগত তথ্য
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in" style={{ display: 'grid', gap: '2rem' }}>
          
          {/* Progress Overview */}
          <div className="grid-2 gap-6">
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>সামগ্রিক অগ্রগতি</h3>
              <div className={styles.progressCircle} style={{ '--progress': `${mockUser.overallProgress}%` }}>
                <div className={styles.progressInner}>
                  <span className={styles.progressValue}>{mockUser.overallProgress}%</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: '12px' }}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>কোর্স সম্পন্ন</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>সর্বমোট</p>
                  </div>
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-latin)' }}>{mockUser.coursesCompleted}</span>
              </div>
              
              <div className="divider" style={{ margin: 0 }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', borderRadius: '12px' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>চলমান কোর্স</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>অধ্যয়নরত</p>
                  </div>
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-latin)' }}>{mockUser.coursesEnrolled}</span>
              </div>
            </div>
          </div>

          {/* Recent Achievements Preview */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>সাম্প্রতিক অর্জন</h3>
              <button onClick={() => setActiveTab('achievements')} className="btn btn-ghost btn-sm">সব দেখুন</button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {mockAchievements.filter(a => a.unlocked).map(achievement => (
                <div key={achievement.id} className="achievement" style={{ flex: '0 0 auto', width: '100px' }}>
                  <div className="achievement-icon" style={{ width: '3rem', height: '3rem', fontSize: '1.25rem' }}>
                    {achievement.icon}
                  </div>
                  <span className="achievement-title" style={{ fontSize: '0.7rem' }}>{achievement.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="animate-fade-in card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>আপনার অর্জন ও ব্যাজসমূহ</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '2rem' }}>
            {mockAchievements.map(achievement => (
              <div key={achievement.id} className="achievement">
                <div className={`achievement-icon ${!achievement.unlocked ? 'locked' : ''}`}>
                  {achievement.icon}
                </div>
                <span className="achievement-title">{achievement.title}</span>
                {!achievement.unlocked && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-light)', marginTop: '-4px' }}>লকড</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div className="animate-fade-in card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ব্যক্তিগত তথ্য</h3>
            <Link href="/profile/edit" className="btn btn-outline btn-sm">তথ্য এডিট করুন</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>মোবাইল নম্বর</div>
              <div className={styles.infoValue}>{mockUser.mobile}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>ইমেইল</div>
              <div className={styles.infoValue}>{mockUser.email}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>শিক্ষা প্রতিষ্ঠান</div>
              <div className={styles.infoValue}>{mockUser.institution}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>ঠিকানা</div>
              <div className={styles.infoValue}>{mockUser.upazila}, {mockUser.district}, {mockUser.division}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>যোগদানের তারিখ</div>
              <div className={styles.infoValue}>{mockUser.joinedDate}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
