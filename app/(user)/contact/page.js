'use client';
import Image from 'next/image';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './contact.module.css';

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
    alert("Message sent successfully! (Demo)");
  };

  return (
    <div className={styles.contactPage}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.textContent}>
              <h1 className={styles.pageTitle}>Get in Touch</h1>
              <p className={styles.pageSubtitle}>
                We'd love to hear from you. Whether you have a question about courses, admissions, or anything else, our team is ready to answer all your questions.
              </p>
            </div>
            <div className={styles.headerIllustration}>
              <Image 
                src="/images/contact-hero.png"
                alt="3D Communication Illustration"
                fill
                className={styles.illustrationImage}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Info Cards */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.mainGrid}>
            
            {/* Contact Form */}
            <div className={styles.formWrapper}>
              <h2 className={styles.formTitle}>Send us a Message</h2>
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" required placeholder="John Doe" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" required placeholder="john@example.com" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" rows="6" required placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Send Message
                </button>
              </form>
            </div>

            {/* Info Cards */}
            <div className={styles.infoWrapper}>
              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <FaEnvelope size={24} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>Email Us</h3>
                  <p className={styles.infoText}>info@iqcacademy.com</p>
                  <p className={styles.infoText}>support@iqcacademy.com</p>
                </div>
              </div>
              
              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <FaPhoneAlt size={24} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>Call Us</h3>
                  <p className={styles.infoText}>+880 1234 567890</p>
                  <p className={styles.infoText}>Sat-Thu, 9am - 6pm (BST)</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <FaMapMarkerAlt size={24} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>Visit Us</h3>
                  <p className={styles.infoText}>IQC Academy HQ<br/>Dhanmondi, Dhaka 1205<br/>Bangladesh</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <div className={styles.mapContainer}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.0369448503!2d90.3671072!3d23.74705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sDhanmondi%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1717600000000!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
