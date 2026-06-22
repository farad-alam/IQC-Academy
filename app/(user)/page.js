'use client';
import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowRight, Heart, PlayCircle, Bell, Clock, Users, Star, Lock, CheckCircle } from 'lucide-react';
import styles from './home.module.css';
import { mockCourses } from '@/lib/mockData';

export default function HomePage() {
  return (
    <div className={styles.home}>
      {/* Clean Hero Section (Inspired by Noorayn Academy) */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          {/* Left Column */}
          <div className={styles.heroLeft}>
            <h1 className={styles.title}>
              কুরআন ও সুন্নাহর <br />
              <span className={styles.titleHighlight}>আলোকে জীবন</span>
            </h1>
            
            <p className={styles.subtitle}>
              ইসলাম শেখার একটি আনন্দময়, সহজ ও অনুপ্রেরণাদায়ক প্ল্যাটফর্ম। 
              বিশুদ্ধ ইলম অর্জন করুন এবং নিজের জীবনকে আলোকিত করুন।
            </p>
            
            <Link href="/courses" className={`btn ${styles.primaryBtn}`}>
              কোর্সসমূহ শুরু করুন
            </Link>

            <div className={styles.statsWidget}>
              <div className={styles.avatars}>
                <div className={styles.avatar}>A</div>
                <div className={styles.avatar}>U</div>
                <div className={styles.avatar}>F</div>
                <div className={styles.avatar}>M</div>
              </div>
              <div className={styles.statsText}>
                <span className={styles.statsCount}>৭০০+</span>
                <span className={styles.statsLabel}>সন্তুষ্ট শিক্ষার্থী</span>
                <div className={styles.stars}>★★★★★ <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>৪.৯ এক্সেলেন্ট</span></div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.heroRight}>
            <div className={styles.rightComposition}>
              {/* Left Column (Cards) */}
              <div className={styles.rcColLeft}>
                {/* Floating Widget 1 */}
                <div className={styles.floatingCard1}>
                  <div className={styles.fc1IconWrapper}>
                    <span style={{ fontSize: '1.25rem' }}>📞</span>
                  </div>
                  <div>
                    <div className={styles.boldText}>২৪/৭</div>
                    <div className={styles.subText}>সাপোর্ট সিস্টেম</div>
                  </div>
                </div>

                {/* Floating Widget 2 */}
                <div className={styles.floatingCard2}>
                  <img src="/images/quran_card.png" alt="Quran" className={styles.quranImg} />
                  <div className={styles.fc2Title}>কুরআন হিফজ</div>
                  <div className={styles.fc2Text}>তাজবীদ সহকারে কুরআন তেলাওয়াত ও মুখস্থ করুন</div>
                  <div className={styles.fc2Btn}>ভর্তি চলছে</div>
                </div>
              </div>

              {/* Right Column (Images) */}
              <div className={styles.rcColRight}>
                {/* Main Tutor Image Card */}
                <div className={styles.mainImageCard}>
                  <img src="/images/hero_tutor.png" alt="IQC Academy Teacher" />
                  {/* Floating Action Icons on Image */}
                  <div className={styles.imageActionRow}>
                     <div className={styles.actionIconDark}>🎤</div>
                     <div className={styles.actionIconDark}>🔊</div>
                     <div className={styles.actionIconGreen}>💬</div>
                     <div className={styles.actionIconRed}>✖</div>
                  </div>
                </div>

                {/* Floating Widget 3 */}
                <div className={styles.floatingCard3}>
                  <div className={styles.fc3IconWrapper}>
                    <span style={{ fontSize: '1.25rem' }}>👨‍🏫</span>
                  </div>
                  <div>
                    <div style={{fontWeight: '800', fontSize: '1.1rem', lineHeight: 1.1}}>৫০+</div>
                    <div style={{fontSize: '0.75rem', opacity: 0.9, fontWeight: 500}}>মেন্টর ও ওস্তাদ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Stats Section (Neon Glow Style) */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {/* Card 1: Students */}
          <div className={`${styles.statCard} ${styles.statCardSmall}`}>
            <div className={styles.glowEffect}></div>
            <div className={styles.statIcon}>👥</div>
            <h3 className={styles.statNumber}>১০০০+</h3>
            <p className={styles.statLabel}>সন্তুষ্ট শিক্ষার্থী</p>
            <p className={styles.statDesc}>দেশ ও বিদেশের অসংখ্য শিক্ষার্থী আমাদের সাথে দ্বীন শিখছেন।</p>
          </div>

          {/* Card 2: Courses */}
          <div className={`${styles.statCard} ${styles.statCardSmall}`}>
            <div className={styles.glowEffect}></div>
            <div className={styles.statIcon}>📚</div>
            <h3 className={styles.statNumber}>২০+</h3>
            <p className={styles.statLabel}>ইসলামিক কোর্স</p>
            <p className={styles.statDesc}>কুরআন, হাদিস ও ফিকহ সহ বিভিন্ন বিষয়ে সমৃদ্ধ কোর্স।</p>
          </div>

          {/* Card 3: Center Highlight (Mentors) */}
          <div className={`${styles.statCard} ${styles.statCardTall}`}>
            <div className={styles.glowEffectCenter}></div>
            <div className={styles.statIconLarge}>🕌</div>
            <h3 className={styles.statNumberLarge}>৫০+</h3>
            <p className={styles.statLabel}>অভিজ্ঞ ওস্তাদ</p>
            <p className={styles.statDescCenter}>স্বীকৃত ইসলামী স্কলার ও হাফেজদের নিবিড় তত্ত্বাবধান এবং সার্বক্ষণিক গাইডলাইন।</p>
            <Link href="/about" className={styles.statBtn}>আমাদের সম্পর্কে জানুন</Link>
          </div>

          {/* Card 4: Years */}
          <div className={`${styles.statCard} ${styles.statCardSmall}`}>
            <div className={styles.glowEffect}></div>
            <div className={styles.statIcon}>⭐</div>
            <h3 className={styles.statNumber}>৫+</h3>
            <p className={styles.statLabel}>বছর দ্বীনি খিদমতে</p>
            <p className={styles.statDesc}>দীর্ঘদিন ধরে বিশ্বস্ততার সাথে দ্বীনি শিক্ষা প্রদান করে আসছি।</p>
          </div>

          {/* Card 5: Satisfaction */}
          <div className={`${styles.statCard} ${styles.statCardSmall}`}>
            <div className={styles.glowEffect}></div>
            <div className={styles.statIcon}>🎯</div>
            <h3 className={styles.statNumber}>৯৯%</h3>
            <p className={styles.statLabel}>সফলতার হার</p>
            <p className={styles.statDesc}>শিক্ষার্থীদের সর্বোচ্চ সন্তুষ্টি ও সাফল্য আমাদের মূল লক্ষ্য।</p>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>আমাদের সেবাসমূহ</h2>
          <p className={styles.sectionSubtitle}>আপনার দ্বীনি জ্ঞান অর্জনের জন্য প্রয়োজনীয় সবকিছু</p>
        </div>

        <div className={styles.bentoGrid}>
          
          {/* Card 1: Courses (Tall Left) - Dark Green */}
          <Link href="/courses" className={`${styles.bentoCard} ${styles.serviceCard1}`}>
            <h3 className={styles.bentoTitleDark}>সার্টিফিকেট কোর্স</h3>
            <p className={styles.bentoDescDark}>ধাপে ধাপে শিখুন এবং কোর্স শেষে যাচাইয়ের মাধ্যমে সার্টিফিকেট অর্জন করুন।</p>
            <div className={styles.bentoImageWrapperTall}>
              <img src="/images/service_courses_1781698562396.png" alt="Courses App UI" className={styles.bentoImgTall} />
            </div>
          </Link>

          {/* Card 2: Madrasa (Top Right Wide) - Light Green */}
          <Link href="/madrasa" className={`${styles.bentoCard} ${styles.serviceCard2}`}>
            <div className={styles.serviceContentWide}>
              <h3 className={styles.bentoTitleLight}>অনলাইন মাদ্রাসা</h3>
              <p className={styles.bentoDescLight}>সিস্টেমেটিক সিলেবাস ভিত্তিক ইসলামিক পড়াশোনার সুযোগ।</p>
            </div>
            <div className={styles.bentoImageWrapperWide}>
              <img src="/images/service_madrasa_1781698576449.png" alt="Madrasa Dashboard" className={styles.bentoImgWide} />
            </div>
          </Link>

          {/* Card 3: Mentors (Middle Square 1) - Light Green Wavy */}
          <Link href="/about" className={`${styles.bentoCard} ${styles.serviceCard3}`}>
            <h3 className={styles.bentoTitleCenter}>১-টু-১ মেন্টরিং</h3>
            <p className={styles.bentoDescCenter}>অভিজ্ঞ স্কলারদের গাইডলাইন</p>
            <div className={styles.mentorsAvatars}>
               <div className={styles.mAvatar}>A</div>
               <div className={styles.mAvatar}>U</div>
               <div className={styles.mAvatar}>F</div>
               <div className={styles.mAvatarStar}>★</div>
            </div>
          </Link>

          {/* Card 4: Articles (Middle Square 2) - Dark Green */}
          <Link href="/content" className={`${styles.bentoCard} ${styles.serviceCard4}`}>
            <h3 className={styles.bentoTitleDark}>আর্টিকেল ও পাবলিকেশনস</h3>
            <p className={styles.bentoDescDark}>কুরআন, হাদিস ও মাসআলা বিষয়ক জ্ঞানগর্ভ প্রবন্ধ।</p>
            <img src="/images/service_articles_1781698588762.png" alt="Articles" className={styles.bentoImgSquare} />
          </Link>

          {/* Card 5: Charity (Bottom Left Wide) - Vibrant Green */}
          <Link href="/projects" className={`${styles.bentoCard} ${styles.serviceCard5}`}>
            <div className={styles.serviceContentWideLeft}>
              <h3 className={styles.bentoTitleVibrant}>সদকাহ ও প্রজেক্ট</h3>
              <p className={styles.bentoDescVibrant}>আমাদের মানবিক ও দা'ওয়াহ কার্যক্রমে অংশগ্রহণ করে সওয়াবের অংশীদার হোন।</p>
            </div>
            <img src="/images/service_charity_1781698611474.png" alt="Charity" className={styles.bentoImgVibrant} />
          </Link>

          {/* Card 6: Quiz (Bottom Right Wide) - Light Green */}
          <Link href="/quiz" className={`${styles.bentoCard} ${styles.serviceCard6}`}>
            <div className={styles.serviceContentWideLeft}>
              <h3 className={styles.bentoTitleLight}>কুইজ ও এক্সাম</h3>
              <p className={styles.bentoDescLight}>প্রতিযোগিতায় অংশ নিন</p>
            </div>
            <img src="/images/service_quiz_1781698622854.png" alt="Quiz" className={styles.bentoImgSquareRight} />
          </Link>

        </div>
      </section>

      {/* Free Courses Section */}
      <section className={styles.coursesSection}>
        <div className={styles.coursesSectionInner}>
          <div className={styles.coursesSectionHeader}>
            <div>
              <span className={styles.coursesBadge}>ফ্রি কোর্স</span>
              <h2 className={styles.coursesSectionTitle}>আমাদের কোর্সসমূহ</h2>
              <p className={styles.coursesSectionSubtitle}>অভিজ্ঞ আলেমদের পরিচালনায় বিনামূল্যে ইসলামিক জ্ঞান অর্জন করুন</p>
            </div>
            <Link href="/courses" className={styles.seeAllBtn}>
              সব কোর্স দেখুন <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.coursesGrid}>
            {mockCourses.filter(c => c.type === 'free').map(course => (
              <Link href={`/courses/${course.id}`} key={course.id} className={styles.courseCard}>
                <div className={styles.courseCardThumb}>
                  <div className={styles.courseCardThumbInner}>
                    <GraduationCap size={40} className={styles.courseThumbIcon} />
                  </div>
                  <span className={`${styles.courseLevel} ${styles[`level_${course.level === 'বেসিক' ? 'basic' : course.level === 'মাঝারি' ? 'mid' : 'adv'}`]}`}>
                    {course.level}
                  </span>
                  {course.status === 'completed' && (
                    <span className={styles.completedBadge}><CheckCircle size={14} /> সম্পন্ন</span>
                  )}
                </div>
                <div className={styles.courseCardBody}>
                  <h3 className={styles.courseCardTitle}>{course.title}</h3>
                  <p className={styles.courseCardDesc}>{course.description}</p>
                  <div className={styles.courseCardMeta}>
                    <span className={styles.metaItem}><Clock size={13} /> {course.duration}</span>
                    <span className={styles.metaItem}><BookOpen size={13} /> {course.totalModules} মডিউল</span>
                  </div>
                  {course.status === 'enrolled' && (
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className={styles.progressText}>{course.progress}% সম্পন্ন</span>
                    </div>
                  )}
                  <div className={styles.courseCardFooter}>
                    <span className={styles.instructorName}>👤 {course.instructor}</span>
                    <span className={styles.freeBadge}>বিনামূল্যে</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Courses Section */}
      <section className={styles.premiumSection}>
        <div className={styles.premiumInner}>
          <div className={styles.premiumHeader}>
            <div>
              <span className={styles.premiumBadge}>💎 প্রিমিয়াম</span>
              <h2 className={styles.premiumTitle}>প্রিমিয়াম কোর্সসমূহ</h2>
              <p className={styles.premiumSubtitle}>বিশেষজ্ঞ আলেমদের তত্ত্বাবধানে গভীর ও বিস্তারিত ইসলামিক শিক্ষা লাভ করুন</p>
            </div>
            <Link href="/courses?type=paid" className={styles.seeAllBtnLight}>
              সব প্রিমিয়াম কোর্স <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.premiumGrid}>
            {mockCourses.filter(c => c.type === 'paid').map(course => (
              <Link href={`/courses/${course.id}`} key={course.id} className={styles.premiumCard}>
                <div className={styles.premiumCardGlow}></div>
                <div className={styles.premiumCardThumb}>
                  <Lock size={36} className={styles.premiumLockIcon} />
                  <div className={styles.premiumStars}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#F59E0B" color="#F59E0B" />)}
                  </div>
                </div>
                <div className={styles.premiumCardBody}>
                  <div className={styles.premiumLevelBadge}>{course.level}</div>
                  <h3 className={styles.premiumCardTitle}>{course.title}</h3>
                  <p className={styles.premiumCardDesc}>{course.description}</p>
                  <div className={styles.premiumCardMeta}>
                    <span className={styles.metaItem}><Clock size={13} /> {course.duration}</span>
                    <span className={styles.metaItem}><BookOpen size={13} /> {course.totalModules} মডিউল</span>
                  </div>
                  <div className={styles.premiumCardFooter}>
                    <span className={styles.premiumInstructor}>👤 {course.instructor}</span>
                    <span className={styles.premiumPrice}>৳ {course.price}</span>
                  </div>
                  <div className={styles.enrollNowBtn}>
                    এখনই ভর্তি হন <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Highlight */}
      <section className={styles.highlightSection}>
        <div className={styles.highlightCard}>
          <div className={styles.highlightContent}>
            <span className={styles.highlightBadge}>নতুন নোটিশ</span>
            <h2 className={styles.highlightTitle}>রমজান প্রস্তুতি কোর্স ২০২৬</h2>
            <p className={styles.highlightDesc}>
              রমজানের ফজিলত, মাসআলা এবং আমলের সঠিক নিয়ম জানতে আমাদের নতুন ফ্রি কোর্সে আজই যুক্ত হোন।
            </p>
          </div>
          <div>
            <Link href="/courses" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
              বিস্তারিত জানুন
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
