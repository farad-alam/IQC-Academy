'use client';
import { useState, useEffect } from 'react';
import { Save, Globe, Phone, Map, Layout, CreditCard, Activity, UserPlus, Users2, Shield } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { toast } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setForbidden(true);
          return;
        }
        throw new Error(data.error);
      }
      setSettings(data);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? String(checked) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success('সেটিংস সফলভাবে সংরক্ষিত হয়েছে');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      toast.error('সেটিংস সংরক্ষণ করা যায়নি');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader /></div>;
  
  if (forbidden) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-error)' }}>অ্যাক্সেস নেই</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>এই পেজটি শুধুমাত্র সুপার এডমিনের জন্য।</p>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>সাইট সেটিংস</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>ওয়েবসাইটের তথ্য এবং কনফিগারেশন পরিবর্তন করুন</p>
      </header>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
       <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-earth-2)', marginBottom: '2rem', flexWrap: 'wrap', paddingBottom: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('general')}
            style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'general' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'general' ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: activeTab === 'general' ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Activity size={18} /> সাধারণ ও লাইভ
          </button>
          <button 
            onClick={() => setActiveTab('payment')}
            style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'payment' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'payment' ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: activeTab === 'payment' ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <CreditCard size={18} /> পেমেন্ট নম্বর
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'contact' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'contact' ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: activeTab === 'contact' ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Phone size={18} /> যোগাযোগ
          </button>
          <button 
            onClick={() => setActiveTab('social')}
            style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'social' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'social' ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: activeTab === 'social' ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Globe size={18} /> সোশ্যাল মিডিয়া
          </button>
          <button 
            onClick={() => setActiveTab('layout')}
            style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'layout' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'layout' ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: activeTab === 'layout' ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Layout size={18} /> ফুটার ও ম্যাপ
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'security' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'security' ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: activeTab === 'security' ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Shield size={18} /> নিরাপত্তা
          </button>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', border: '1px solid var(--color-earth-1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: settings.site_is_live === 'true' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ওয়েবসাইট লাইভ স্ট্যাটাস
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: settings.site_is_live === 'true' ? 'var(--color-success)' : 'var(--color-error)' }}></span>
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    এটি বন্ধ থাকলে ভিজিটররা মেইনটেন্যান্স পেজ দেখতে পাবেন।
                  </p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input 
                    type="checkbox" 
                    name="site_is_live" 
                    checked={settings.site_is_live === 'true'} 
                    onChange={handleChange}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{ 
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: settings.site_is_live === 'true' ? 'var(--color-success)' : '#ccc', 
                    transition: '.4s', borderRadius: '34px' 
                  }}>
                    <span style={{ 
                      position: 'absolute', content: '""', height: '26px', width: '26px', left: '4px', bottom: '4px', 
                      backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                      transform: settings.site_is_live === 'true' ? 'translateX(26px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>

              {/* Individual Registration Toggle */}
              <div style={{ padding: '1.5rem', border: '1px solid var(--color-earth-1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: settings.individual_registration_open === 'true' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserPlus size={18} />
                    ব্যক্তিগত রেজিস্ট্রেশন
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: settings.individual_registration_open === 'true' ? 'var(--color-success)' : 'var(--color-error)' }}></span>
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    বন্ধ থাকলে /register পেজে গেলে "রেজিস্ট্রেশন বন্ধ আছে" বার্তা দেখাবে।
                  </p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px', flexShrink: 0 }}>
                  <input type="checkbox" name="individual_registration_open" checked={settings.individual_registration_open === 'true'} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.individual_registration_open === 'true' ? 'var(--color-success)' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                    <span style={{ position: 'absolute', height: '26px', width: '26px', left: '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: settings.individual_registration_open === 'true' ? 'translateX(26px)' : 'translateX(0)' }} />
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label>বিকাশ নম্বর (Personal)</label>
                <input type="text" className="form-input" name="bkash_number" value={settings.bkash_number || ''} onChange={handleChange} placeholder="যেমন: 01700000000" />
              </div>
              <div className="form-group">
                <label>নগদ নম্বর (Personal)</label>
                <input type="text" className="form-input" name="nagad_number" value={settings.nagad_number || ''} onChange={handleChange} placeholder="যেমন: 01800000000" />
              </div>
              <div className="form-group">
                <label>রকেট নম্বর (Personal)</label>
                <input type="text" className="form-input" name="rocket_number" value={settings.rocket_number || ''} onChange={handleChange} placeholder="যেমন: 01900000000" />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label>মোবাইল নম্বর (কলের জন্য)</label>
                <input type="text" className="form-input" name="contact_phone" value={settings.contact_phone || ''} onChange={handleChange} placeholder="+880 1700 000000" />
              </div>
              <div className="form-group">
                <label>হোয়াটসঅ্যাপ নম্বর (লিংকের জন্য)</label>
                <input type="text" className="form-input" name="contact_whatsapp" value={settings.contact_whatsapp || ''} onChange={handleChange} placeholder="8801700000000 (বিনা + এ)" />
              </div>
              <div className="form-group">
                <label>ইমেইল ঠিকানা</label>
                <input type="email" className="form-input" name="contact_email" value={settings.contact_email || ''} onChange={handleChange} placeholder="info@iqcacademy.com" />
              </div>
              <div className="form-group">
                <label>অফিসের ঠিকানা</label>
                <textarea className="form-input" name="contact_address" value={settings.contact_address || ''} onChange={handleChange} rows="3" placeholder="ঠিকানা লিখুন"></textarea>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label>ফেসবুক পেজ লিংক</label>
                <input type="url" className="form-input" name="facebook_url" value={settings.facebook_url || ''} onChange={handleChange} placeholder="https://facebook.com/..." />
              </div>
              <div className="form-group">
                <label>ইউটিউব চ্যানেল লিংক</label>
                <input type="url" className="form-input" name="youtube_url" value={settings.youtube_url || ''} onChange={handleChange} placeholder="https://youtube.com/..." />
              </div>
              <div className="form-group">
                <label>ইন্সটাগ্রাম লিংক</label>
                <input type="url" className="form-input" name="instagram_url" value={settings.instagram_url || ''} onChange={handleChange} placeholder="https://instagram.com/..." />
              </div>
              <div className="form-group">
                <label>টুইটার (X) লিংক</label>
                <input type="url" className="form-input" name="twitter_url" value={settings.twitter_url || ''} onChange={handleChange} placeholder="https://twitter.com/..." />
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label>ফুটার ট্যাগলাইন</label>
                <textarea className="form-input" name="footer_tagline" value={settings.footer_tagline || ''} onChange={handleChange} rows="2" placeholder="কুরআন ও সুন্নাহর আলোকে..."></textarea>
              </div>
              <div className="form-group">
                <label>গুগল ম্যাপ এমবেড URL (src)</label>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Google Maps থেকে iframe এর src অংশের লিংকটি কপি করে পেস্ট করুন।</p>
                <textarea className="form-input" name="google_maps_embed" value={settings.google_maps_embed || ''} onChange={handleChange} rows="4" placeholder="https://www.google.com/maps/embed?..."></textarea>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', border: '1px solid var(--color-error)', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-error)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={20} /> ডিলিট সিকিউরিটি কী (Deletion Security Key)
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  কোর্স, সাবজেক্ট, মডিউল, কুইজ ইত্যাদি মুছে ফেলার জন্য এই পাসওয়ার্ডটি প্রয়োজন হবে। এটি সেট না করলে কোনো কিছুই মুছে ফেলা যাবে না।
                </p>
                <div className="form-group">
                  <label>সিকিউরিটি পাসওয়ার্ড</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    name="deletion_security_key" 
                    value={settings.deletion_security_key || ''} 
                    onChange={handleChange} 
                    placeholder="পাসওয়ার্ড লিখুন..." 
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} /> {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
       </div>
      </div>
    </div>
  );
}
