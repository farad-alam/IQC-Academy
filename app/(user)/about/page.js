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
                ইসলামী শিক্ষার <span className={styles.highlight}>ভবিষ্যৎ</span> রূপদান
              </h1>
              <p className={styles.heroText}>
                আইকিউসি (IQC) একাডেমি একটি উদ্ভাবনী প্রতিষ্ঠান যা আধুনিক শিক্ষা কাঠামোর সাথে শাস্ত্রীয় ইসলামী জ্ঞানের সমন্বয় সাধনে নিবেদিত। আমাদের লক্ষ্য এমন ব্যক্তিদের গড়ে তোলা যারা আধ্যাত্মিকভাবে প্রতিষ্ঠিত এবং পেশাগতভাবে দক্ষ।
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
              <h2 className={styles.sectionTitle}>আমাদের লক্ষ্য</h2>
              <p className={styles.cardText}>
                একটি ব্যাপক পাঠ্যক্রমের মাধ্যমে খাঁটি ইসলামী শিক্ষা প্রদান করা যা শিক্ষার্থীদের সমসাময়িক সমাজে গভীর জ্ঞান, সমালোচনামূলক চিন্তাভাবনা এবং তাদের বিশ্বাসের গভীর উপলব্ধি দিয়ে ক্ষমতায়ন করে।
              </p>
            </div>
            <div className={`${styles.missionCard} ${styles.visionCard}`}>
              <h2 className={styles.sectionTitle}>আমাদের ভিশন</h2>
              <p className={styles.cardText}>
                ইসলামী শিক্ষার জন্য শীর্ষস্থানীয় গ্লোবাল একাডেমি হওয়া, আত্মবিশ্বাসী, জ্ঞানী এবং সহানুভূতিশীল নেতাদের একটি প্রজন্ম তৈরি করা যারা তাদের সমাজে ইতিবাচক প্রভাব ফেলে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>মূল্যবোধ</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <h3 className={styles.valueTitle}>প্রামাণিকতা</h3>
              <p className={styles.valueText}>কুরআন এবং সুন্নাহর উপর ভিত্তি করে, প্রতিটি কোর্স সত্য এবং খাঁটি জ্ঞান প্রদান করে তা নিশ্চিত করা।</p>
            </div>
            <div className={styles.valueItem}>
              <h3 className={styles.valueTitle}>উৎকর্ষতা</h3>
              <p className={styles.valueText}>শিক্ষাদান, পাঠ্যক্রম ডিজাইন এবং ছাত্র সহায়তার সর্বোচ্চ মানের প্রতি প্রতিশ্রুতিবদ্ধ।</p>
            </div>
            <div className={styles.valueItem}>
              <h3 className={styles.valueTitle}>অন্তর্ভুক্তি</h3>
              <p className={styles.valueText}>সকল পটভূমি এবং জীবনের স্তরের শিক্ষার্থীদের জন্য একটি স্বাগত পরিবেশ তৈরি করা।</p>
            </div>
            <div className={styles.valueItem}>
              <h3 className={styles.valueTitle}>উদ্ভাবন</h3>
              <p className={styles.valueText}>আধুনিক প্রযুক্তি এবং আকর্ষক পদ্ধতি ব্যবহার করে শিক্ষাকে যে কোনো জায়গায় অ্যাক্সেসযোগ্য করে তোলা।</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
