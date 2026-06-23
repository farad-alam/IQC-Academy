import Image from 'next/image';
import styles from './about.module.css';

export const metadata = {
  title: 'About Us | IQC Academy',
  description: 'Learn more about IQC Academy, our mission, vision, and core values.',
};

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                <span className={styles.highlight}>Shaping</span> the Future of Islamic Education
              </h1>
              <p className={styles.heroText}>
                IQC Academy is an innovative institution dedicated to blending classical Islamic knowledge with modern educational frameworks. Our goal is to nurture individuals who are both spiritually grounded and professionally equipped.
              </p>
            </div>
            <div className={styles.heroImageWrapper}>
              <Image 
                src="/images/about-hero.png" 
                alt="3D Abstract Geometric Illustration" 
                fill
                className={styles.heroImage}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <h2 className={styles.sectionTitle}>Our Mission</h2>
              <p className={styles.cardText}>
                To provide authentic Islamic education through a comprehensive curriculum that empowers students with profound knowledge, critical thinking, and a deep understanding of their faith in contemporary society.
              </p>
            </div>
            <div className={`${styles.missionCard} ${styles.visionCard}`}>
              <h2 className={styles.sectionTitle}>Our Vision</h2>
              <p className={styles.cardText}>
                To be the leading global academy for Islamic learning, fostering a generation of confident, knowledgeable, and compassionate leaders who positively impact their communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <h3 className={styles.valueTitle}>Authenticity</h3>
              <p className={styles.valueText}>Rooted in the Quran and Sunnah, ensuring that every course delivers true and pure knowledge.</p>
            </div>
            <div className={styles.valueItem}>
              <h3 className={styles.valueTitle}>Excellence</h3>
              <p className={styles.valueText}>Committing to the highest standards of teaching, curriculum design, and student support.</p>
            </div>
            <div className={styles.valueItem}>
              <h3 className={styles.valueTitle}>Inclusivity</h3>
              <p className={styles.valueText}>Creating a welcoming environment for learners from all backgrounds and walks of life.</p>
            </div>
            <div className={styles.valueItem}>
              <h3 className={styles.valueTitle}>Innovation</h3>
              <p className={styles.valueText}>Utilizing modern technology and engaging methodologies to make learning accessible anywhere.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
