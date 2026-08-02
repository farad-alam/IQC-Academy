'use client';
import { useState, useEffect } from 'react';
import { Power } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function GoLiveToggle() {
  const [isLive, setIsLive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setIsLive(data.site_is_live === 'true');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggle = async () => {
    const newValue = !isLive;
    setIsLive(newValue);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site_is_live: String(newValue) })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(newValue ? 'ওয়েবসাইট এখন লাইভ!' : 'ওয়েবসাইট এখন মেইনটেন্যান্স মোডে আছে');
    } catch (err) {
      setIsLive(!newValue);
      toast.error('স্ট্যাটাস পরিবর্তন করা যায়নি');
    }
  };

  if (loading) return null;

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderLeft: `4px solid ${isLive ? 'var(--color-success)' : 'var(--color-error)'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: isLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isLive ? 'var(--color-success)' : 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Power size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ওয়েবসাইট স্ট্যাটাস</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            বর্তমান অবস্থা: <strong style={{ color: isLive ? 'var(--color-success)' : 'var(--color-error)' }}>{isLive ? 'লাইভ (পাবলিক)' : 'মেইনটেন্যান্স (লুকানো)'}</strong>
          </p>
        </div>
      </div>
      
      <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
        <input 
          type="checkbox" 
          checked={isLive} 
          onChange={handleToggle}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span style={{ 
          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: isLive ? 'var(--color-success)' : '#ccc', 
          transition: '.4s', borderRadius: '34px' 
        }}>
          <span style={{ 
            position: 'absolute', content: '""', height: '26px', width: '26px', left: '4px', bottom: '4px', 
            backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
            transform: isLive ? 'translateX(26px)' : 'translateX(0)'
          }} />
        </span>
      </label>
    </div>
  );
}
