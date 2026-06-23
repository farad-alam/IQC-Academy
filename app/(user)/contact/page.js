'use client';
import Image from 'next/image';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './contact.module.css';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
    alert("বার্তা সফলভাবে পাঠানো হয়েছে! (ডেমো)");
  };

  return (
    <div className={styles.contactPage}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <FadeIn direction="up" className={styles.textContent}>
              <h1 className={styles.pageTitle}>যোগাযোগ করুন</h1>
              <p className={styles.pageSubtitle}>
                আমরা আপনার কথা শুনতে চাই। কোর্স, ভর্তি বা অন্য যে কোনও বিষয়ে আপনার যদি কোনও প্রশ্ন থাকে, আমাদের দল আপনার সমস্ত প্রশ্নের উত্তর দিতে প্রস্তুত।
              </p>
            </FadeIn>
            <FadeIn direction="left" delay={0.2} className={styles.headerIllustration}>
              <Image 
                src="/images/contact-hero.png"
                alt="3D Communication Illustration"
                fill
                className={styles.illustrationImage}
                priority
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Info Cards */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.mainGrid}>
            
            {/* Contact Form */}
            <FadeIn direction="up" className={styles.formWrapper}>
              <h2 className={styles.formTitle}>আমাদের বার্তা পাঠান</h2>
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">পুরো নাম</label>
                  <input type="text" id="name" required placeholder="আপনার নাম" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">ইমেইল ঠিকানা</label>
                  <input type="email" id="email" required placeholder="আপনার ইমেইল" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="message">আপনার বার্তা</label>
                  <textarea id="message" rows="6" required placeholder="আমরা আপনাকে কীভাবে সাহায্য করতে পারি?"></textarea>
                </div>
                <button type="submit" className={styles.submitBtn}>
                  বার্তা পাঠান
                </button>
              </form>
            </FadeIn>

            {/* Info Cards */}
            <StaggerContainer className={styles.infoWrapper}>
              <StaggerItem direction="up" className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <FaEnvelope size={24} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>ইমেইল করুন</h3>
                  <p className={styles.infoText}>info@iqcacademy.com</p>
                  <p className={styles.infoText}>support@iqcacademy.com</p>
                </div>
              </StaggerItem>
              
              <StaggerItem direction="up" className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <FaPhoneAlt size={24} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>কল করুন</h3>
                  <p className={styles.infoText}>+880 1234 567890</p>
                  <p className={styles.infoText}>শনি-বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা</p>
                </div>
              </StaggerItem>

              <StaggerItem direction="up" className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <FaMapMarkerAlt size={24} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>পরিদর্শন করুন</h3>
                  <p className={styles.infoText}>IQC Academy HQ<br/>Dhanmondi, Dhaka 1205<br/>Bangladesh</p>
                </div>
              </StaggerItem>
            </StaggerContainer>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <FadeIn direction="up" className={styles.mapContainer}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.0369448503!2d90.3671072!3d23.74705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sDhanmondi%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1717600000000!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
