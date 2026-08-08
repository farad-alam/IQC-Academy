'use client';
import { useState } from 'react';
import LearnSidebar from '@/components/learn/LearnSidebar';
import LearnTopBar from '@/components/learn/LearnTopBar';

export default function LearnLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <LearnSidebar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <LearnTopBar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
