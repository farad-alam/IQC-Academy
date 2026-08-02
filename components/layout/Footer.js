import { FaFacebookF, FaYoutube, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import styles from './Footer.module.css';
import { getSiteSettings } from '@/lib/siteSettings';

export default async function Footer() {
  const settings = await getSiteSettings([
    'contact_email', 'contact_phone', 'contact_address',
    'facebook_url', 'youtube_url', 'instagram_url', 'twitter_url',
    'google_maps_embed'
  ]);

  return (
    <footer className={styles.footer}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.topGrid}>
          {/* Column 1: Communication Area */}
          <div className={`${styles.gridItem} ${styles.communicationArea}`}>
            <div className={styles.contactBlock}>
              <h3 className={styles.contactTitle}>যোগাযোগ</h3>
              <ul className={styles.contactList}>
                <li>ইমেইল: {settings.contact_email}</li>
                <li>মোবাইল: {settings.contact_phone}</li>
                <li>ঠিকানা: {settings.contact_address}</li>
              </ul>
            </div>

            <div className={styles.socialsBlock}>
              <h3 className={styles.contactTitle}>সোশ্যাল মিডিয়া</h3>
              <div className={styles.socialsGrid}>
                {settings.facebook_url && settings.facebook_url !== '#' && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF size={18} /></a>}
                {settings.youtube_url && settings.youtube_url !== '#' && <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube size={20} /></a>}
                {settings.instagram_url && settings.instagram_url !== '#' && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={20} /></a>}
                {settings.twitter_url && settings.twitter_url !== '#' && <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaXTwitter size={18} /></a>}
              </div>
            </div>
          </div>

          {/* Column 3: Google Maps */}
          <div className={`${styles.gridItem} ${styles.mapContainer}`}>
            {settings.google_maps_embed && (
              <iframe 
                src={settings.google_maps_embed} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            )}
          </div>
        </div>

        <div className={styles.brandHuge}>
          <span>IQC</span>
          <span>Academy</span>
        </div>

        <div className={styles.credits}>
          Design & Develop by <a href="https://www.motionbite.com/" target="_blank" rel="noopener noreferrer" className={styles.motionBiteLink}>MotionBite</a>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/courses" className={styles.navLink}>
          Courses
        </Link>
        <Link href="/projects" className={styles.navLink}>
          Projects
        </Link>
        <Link href="/madrasa" className={styles.navLink}>
          Madrasa
        </Link>
        <Link href="/donate" className={styles.navLink}>
          Donate
        </Link>
        
        <div className={styles.bottomRow}>
          <button className={styles.langBtn}>EN</button>
          <button className={styles.langBtn}>বাংলা</button>
        </div>
      </div>
    </footer>
  );
}
