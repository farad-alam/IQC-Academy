import prisma from '@/lib/db';
import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowRight, Heart, PlayCircle, Bell, Clock, Users, Star, Lock, CheckCircle, Target, MapPin, Users2, Image as ImageIcon, MessageCircle, Phone, HelpCircle, ChevronDown, Send, Quote } from 'lucide-react';
import styles from './home.module.css';
import { mockFaq, mockTestimonials } from '@/lib/mockData';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [courses, projects, galleryItems, latestNotice] = await Promise.all([
    prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: { _count: { select: { modules: true } }, instructor: true },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    prisma.project.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 4
    }),
    prisma.galleryItem.findMany({
      orderBy: { date: 'desc' },
      take: 6
    }),
    prisma.notice.findFirst({
      where: { publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: 'desc' }
    })
  ]);
  return (
    <div className={styles.home}>
      {/* Clean Hero Section (Inspired by Noorayn Academy) */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          {/* Left Column */}
          <FadeIn direction="up" delay={0.1} className={styles.heroLeft}>
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
          </FadeIn>

          {/* Right Column */}
          <FadeIn direction="left" delay={0.3} className={styles.heroRight}>
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
          </FadeIn>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className={styles.servicesSection}>
        <FadeIn direction="up" className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>আমাদের সেবাসমূহ</h2>
          <p className={styles.sectionSubtitle}>আপনার দ্বীনি জ্ঞান অর্জনের জন্য প্রয়োজনীয় সবকিছু</p>
        </FadeIn>

        <StaggerContainer className={styles.bentoGrid}>
          
          {/* Card 1: Courses (Tall Left) - Dark Green */}
          <StaggerItem direction="up" className={`${styles.bentoCard} ${styles.serviceCard1}`}>
            <Link href="/courses" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}>
              <h3 className={styles.bentoTitleDark}>সার্টিফিকেট কোর্স</h3>
              <p className={styles.bentoDescDark}>ধাপে ধাপে শিখুন এবং কোর্স শেষে যাচাইয়ের মাধ্যমে সার্টিফিকেট অর্জন করুন।</p>
              <div className={styles.bentoImageWrapperTall}>
                <img src="/images/service_courses_1781698562396.png" alt="Courses App UI" className={styles.bentoImgTall} />
              </div>
            </Link>
          </StaggerItem>

          {/* Card 2: Madrasa (Top Right Wide) - Light Green */}
          <StaggerItem direction="up" className={`${styles.bentoCard} ${styles.serviceCard2}`}>
            <Link href="/madrasa" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
              <div className={styles.serviceContentWide}>
                <h3 className={styles.bentoTitleLight}>অনলাইন মাদ্রাসা</h3>
                <p className={styles.bentoDescLight}>সিস্টেমেটিক সিলেবাস ভিত্তিক ইসলামিক পড়াশোনার সুযোগ।</p>
              </div>
              <div className={styles.bentoImageWrapperWide}>
                <img src="/images/service_madrasa_1781698576449.png" alt="Madrasa Dashboard" className={styles.bentoImgWide} />
              </div>
            </Link>
          </StaggerItem>

          {/* Card 3: Mentors (Middle Square 1) - Light Green Wavy */}
          <StaggerItem direction="up" className={`${styles.bentoCard} ${styles.serviceCard3}`}>
            <Link href="/about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', textDecoration: 'none' }}>
              <h3 className={styles.bentoTitleCenter}>১-টু-১ মেন্টরিং</h3>
              <p className={styles.bentoDescCenter}>অভিজ্ঞ স্কলারদের গাইডলাইন</p>
              <div className={styles.mentorsAvatars}>
                 <div className={styles.mAvatar}>A</div>
                 <div className={styles.mAvatar}>U</div>
                 <div className={styles.mAvatar}>F</div>
                 <div className={styles.mAvatarStar}>★</div>
              </div>
            </Link>
          </StaggerItem>

          {/* Card 4: Articles (Middle Square 2) - Dark Green */}
          <StaggerItem direction="up" className={`${styles.bentoCard} ${styles.serviceCard4}`}>
            <Link href="/content" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}>
              <h3 className={styles.bentoTitleDark}>আর্টিকেল ও পাবলিকেশনস</h3>
              <p className={styles.bentoDescDark}>কুরআন, হাদিস ও মাসআলা বিষয়ক জ্ঞানগর্ভ প্রবন্ধ।</p>
              <img src="/images/service_articles_1781698588762.png" alt="Articles" className={styles.bentoImgSquare} />
            </Link>
          </StaggerItem>

          {/* Card 5: Charity (Bottom Left Wide) - Vibrant Green */}
          <StaggerItem direction="up" className={`${styles.bentoCard} ${styles.serviceCard5}`}>
            <Link href="/projects" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
              <div className={styles.serviceContentWideLeft}>
                <h3 className={styles.bentoTitleVibrant}>সদকাহ ও প্রজেক্ট</h3>
                <p className={styles.bentoDescVibrant}>আমাদের মানবিক ও দা'ওয়াহ কার্যক্রমে অংশগ্রহণ করে সওয়াবের অংশীদার হোন।</p>
              </div>
              <img src="/images/service_charity_1781698611474.png" alt="Charity" className={styles.bentoImgVibrant} />
            </Link>
          </StaggerItem>

          {/* Card 6: Quiz (Bottom Right Wide) - Light Green */}
          <StaggerItem direction="up" className={`${styles.bentoCard} ${styles.serviceCard6}`}>
            <Link href="/quiz" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
              <div className={styles.serviceContentWideLeft}>
                <h3 className={styles.bentoTitleLight}>কুইজ ও এক্সাম</h3>
                <p className={styles.bentoDescLight}>প্রতিযোগিতায় অংশ নিন</p>
              </div>
              <img src="/images/service_quiz_1781698622854.png" alt="Quiz" className={styles.bentoImgSquareRight} />
            </Link>
          </StaggerItem>

        </StaggerContainer>
      </section>

      {/* Free Courses Section */}
      <section className={styles.coursesSection}>
        <div className={styles.coursesSectionInner}>
          <FadeIn direction="up" className={styles.coursesSectionHeader}>
            <div>
              <span className={styles.coursesBadge}>ফ্রি কোর্স</span>
              <h2 className={styles.coursesSectionTitle}>আমাদের কোর্সসমূহ</h2>
              <p className={styles.coursesSectionSubtitle}>অভিজ্ঞ আলেমদের পরিচালনায় বিনামূল্যে ইসলামিক জ্ঞান অর্জন করুন</p>
            </div>
            <Link href="/courses" className={styles.seeAllBtn}>
              সব কোর্স দেখুন <ArrowRight size={16} />
            </Link>
          </FadeIn>

          <StaggerContainer className={styles.coursesGrid}>
            {courses.filter(c => c.type === 'FREE').map(course => (
              <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                <StaggerItem className={styles.courseCard}>
                  <div className={styles.courseCardThumb}>
                    <div className={styles.courseCardThumbInner}>
                      <GraduationCap size={40} className={styles.courseThumbIcon} />
                    </div>
                    <span className={`${styles.courseLevel} ${styles[`level_${course.level === 'বেসিক' ? 'basic' : course.level === 'মাঝারি' ? 'mid' : 'adv'}`]}`}>
                      {course.level}
                    </span>
                  </div>
                  <div className={styles.courseCardBody}>
                    <h3 className={styles.courseCardTitle}>{course.title}</h3>
                    <p className={styles.courseCardDesc}>{course.description}</p>
                    <div className={styles.courseCardMeta}>
                      <span className={styles.metaItem}><Clock size={13} /> {course.duration}</span>
                      <span className={styles.metaItem}><BookOpen size={13} /> {course._count?.modules || 0} মডিউল</span>
                    </div>
                    <div className={styles.courseCardFooter}>
                      <span className={styles.instructorName}>👤 {course.instructor?.name || 'IQC Academy'}</span>
                      <span className={styles.freeBadge}>বিনামূল্যে</span>
                    </div>
                  </div>
                </StaggerItem>
              </Link>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Premium Courses Section */}
      <section className={styles.premiumSection}>
        <div className={styles.premiumInner}>
          <FadeIn direction="up" className={styles.premiumHeader}>
            <div>
              <span className={styles.premiumBadge}>💎 প্রিমিয়াম</span>
              <h2 className={styles.premiumTitle}>প্রিমিয়াম কোর্সসমূহ</h2>
              <p className={styles.premiumSubtitle}>বিশেষজ্ঞ আলেমদের তত্ত্বাবধানে গভীর ও বিস্তারিত ইসলামিক শিক্ষা লাভ করুন</p>
            </div>
            <Link href="/courses?type=paid" className={styles.seeAllBtnLight}>
              সব প্রিমিয়াম কোর্স <ArrowRight size={16} />
            </Link>
          </FadeIn>

          <StaggerContainer className={styles.premiumGrid}>
            {courses.filter(c => c.type === 'PAID').map(course => (
              <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                <StaggerItem className={styles.premiumCard}>
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
                      <span className={styles.metaItem}><BookOpen size={13} /> {course._count?.modules || 0} মডিউল</span>
                    </div>
                    <div className={styles.premiumCardFooter}>
                      <span className={styles.premiumInstructor}>👤 {course.instructor?.name || 'IQC Academy'}</span>
                      <span className={styles.premiumPrice}>৳ {course.price?.toString()}</span>
                    </div>
                    <div className={styles.enrollNowBtn}>
                      এখনই ভর্তি হন <ArrowRight size={14} />
                    </div>
                  </div>
                </StaggerItem>
              </Link>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Projects Section */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsInner}>
          <FadeIn direction="up" className={styles.projectsHeader}>
            <div>
              <span className={styles.projectsBadge}>🌟 सদকাহ ও প্রজেক্ট</span>
              <h2 className={styles.projectsTitle}>আমাদের চলমান প্রকল্পসমূহ</h2>
              <p className={styles.projectsSubtitle}>সদকায়ে জারিয়ার সুযোগে অংশ নিন — প্রতিটি দান আপনার আমলনামায় স্থায়ী হয়ে যাবে</p>
            </div>
            <Link href="/projects" className={styles.seeAllBtn}>
              সব প্রকল্প দেখুন <ArrowRight size={16} />
            </Link>
          </FadeIn>

          <StaggerContainer className={styles.projectsGrid}>
            {projects.map(project => {
              const raised = Number(project.raisedAmount) || 0;
              const target = Number(project.targetAmount) || 1;
              const progress = Math.min(100, Math.round((raised / target) * 100));
              
              return (
              <StaggerItem key={project.id} direction="up" className={styles.projectCard}>
                <div className={styles.projectCardImg}>
                  {project.icon ? (
                    <div style={{ fontSize: '4rem', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-surface-alt)' }}>{project.icon}</div>
                  ) : (
                    <div style={{ height: '200px', backgroundColor: 'var(--color-surface-alt)' }}></div>
                  )}
                  <div className={styles.projectImgOverlay}>
                    <span className={`${styles.projectStatus} ${progress >= 90 ? styles.statusAlmost : styles.statusActive}`}>
                      {progress >= 100 ? 'সম্পন্ন' : 'চলমান'}
                    </span>
                  </div>
                </div>
                <div className={styles.projectCardBody}>
                  <div className={styles.projectMeta}>
                    <span className={styles.projectCategory}>{project.icon} {project.title}</span>
                  </div>
                  <h3 className={styles.projectCardTitle}>{project.title}</h3>
                  <p className={styles.projectCardDesc}>{project.description}</p>
                  <div className={styles.projectProgress}>
                    <div className={styles.projectProgressTop}>
                      <span className={styles.projectRaised}>৳{raised.toLocaleString('bn-BD')}</span>
                      <span className={styles.projectTarget}>লক্ষ্য: ৳{target.toLocaleString('bn-BD')}</span>
                    </div>
                    <div className={styles.projectProgressBar}>
                      <div className={styles.projectProgressFill} style={{ width: `${progress}%` }} />
                    </div>
                    <div className={styles.projectProgressBottom}>
                      <span className={styles.projectPercent}>{progress}% সম্পন্ন</span>
                    </div>
                  </div>
                  <Link href={`/donate?project=${project.id}`} className={styles.donateBtn}>
                    <Heart size={15} /> এখনই দান করুন
                  </Link>
                </div>
              </StaggerItem>
            )})}
          </StaggerContainer>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryInner}>
          <FadeIn direction="up" className={styles.galleryHeader}>
            <div>
              <span className={styles.galleryBadge}>🖼️ গ্যালারি</span>
              <h2 className={styles.galleryTitle}>আমাদের কার্যক্রমের ছবি</h2>
              <p className={styles.gallerySubtitle}>আইকিউসি অ্যাকাডেমির বিভিন্ন কার্যক্রম, ইভেন্ট ও প্রকল্পের আলোকচিত্র দেখুন</p>
            </div>
            <Link href="/gallery" className={styles.seeAllBtn}>
              পূর্ণ গ্যালারি <ArrowRight size={16} />
            </Link>
          </FadeIn>

          <StaggerContainer className={styles.galleryGrid}>
            {galleryItems.map((item, index) => (
              <StaggerItem key={item.id} direction="up" className={`${styles.galleryItem} ${index === 0 ? styles.galleryItemLarge : ''}`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className={styles.galleryImg} />
                ) : (
                  <div className={styles.galleryImg} style={{ backgroundColor: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.2 }}>📷</div>
                )}
                <div className={styles.galleryOverlay}>
                  <span className={styles.galleryItemType}>
                    {item.type === 'event' ? 'ইভেন্ট' : item.type === 'class' ? 'ক্লাস' : 'প্রজেক্ট'}
                  </span>
                  <h4 className={styles.galleryItemTitle}>{item.title}</h4>
                  <p className={styles.galleryItemDate}>
                    {new Date(item.date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Premium Stats Section (Neon Glow Style) */}
      <section className={styles.statsSection}>
        <StaggerContainer className={styles.statsGrid}>
          {/* Card 1: Students */}
          <StaggerItem direction="up" className={`${styles.statCard} ${styles.statCardSmall}`}>
            <div className={styles.glowEffect}></div>
            <div className={styles.statIcon}>👥</div>
            <h3 className={styles.statNumber}>১০০০+</h3>
            <p className={styles.statLabel}>সন্তুষ্ট শিক্ষার্থী</p>
            <p className={styles.statDesc}>দেশ ও বিদেশের অসংখ্য শিক্ষার্থী আমাদের সাথে দ্বীন শিখছেন।</p>
          </StaggerItem>

          {/* Card 2: Courses */}
          <StaggerItem direction="up" className={`${styles.statCard} ${styles.statCardSmall}`}>
            <div className={styles.glowEffect}></div>
            <div className={styles.statIcon}>📚</div>
            <h3 className={styles.statNumber}>২০+</h3>
            <p className={styles.statLabel}>ইসলামিক কোর্স</p>
            <p className={styles.statDesc}>কুরআন, হাদিস ও ফিকহ সহ বিভিন্ন বিষয়ে সমৃদ্ধ কোর্স।</p>
          </StaggerItem>

          {/* Card 3: Center Highlight (Mentors) */}
          <StaggerItem direction="up" className={`${styles.statCard} ${styles.statCardTall}`}>
            <div className={styles.glowEffectCenter}></div>
            <div className={styles.statIconLarge}>🕌</div>
            <h3 className={styles.statNumberLarge}>৫০+</h3>
            <p className={styles.statLabel}>অভিজ্ঞ ওস্তাদ</p>
            <p className={styles.statDescCenter}>স্বীকৃত ইসলামী স্কলার ও হাফেজদের নিবিড় তত্ত্বাবধান এবং সার্বক্ষণিক গাইডলাইন।</p>
            <Link href="/about" className={styles.statBtn}>আমাদের সম্পর্কে জানুন</Link>
          </StaggerItem>

          {/* Card 4: Years */}
          <StaggerItem direction="up" className={`${styles.statCard} ${styles.statCardSmall}`}>
            <div className={styles.glowEffect}></div>
            <div className={styles.statIcon}>⭐</div>
            <h3 className={styles.statNumber}>৫+</h3>
            <p className={styles.statLabel}>বছর দ্বীনি খিদমতে</p>
            <p className={styles.statDesc}>দীর্ঘদিন ধরে বিশ্বস্ততার সাথে দ্বীনি শিক্ষা প্রদান করে আসছি।</p>
          </StaggerItem>

          {/* Card 5: Satisfaction */}
          <StaggerItem direction="up" className={`${styles.statCard} ${styles.statCardSmall}`}>
            <div className={styles.glowEffect}></div>
            <div className={styles.statIcon}>🎯</div>
            <h3 className={styles.statNumber}>৯৯%</h3>
            <p className={styles.statLabel}>সফলতার হার</p>
            <p className={styles.statDesc}>শিক্ষার্থীদের সর্বোচ্চ সন্তুষ্টি ও সাফল্য আমাদের মূল লক্ষ্য।</p>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsInner}>
          <FadeIn direction="up" className={styles.testimonialsHeader}>
            <span className={styles.testimonialsBadge}>✨ শিক্ষার্থী ও অভিভাবকদের মতামত</span>
            <h2 className={styles.testimonialsTitle}>যাদের জীবন আইকিউসি অ্যাকাডেমির মাধ্যমে আলোকিত</h2>
            <p className={styles.testimonialsSubtitle}>আমাদের শিক্ষার্থীদের বাস্তব অভিজ্ঞতা ও সাফল্যের গল্প</p>
          </FadeIn>

          <StaggerContainer className={styles.testimonialsGrid}>
            {mockTestimonials.map(testimonial => (
              <StaggerItem key={testimonial.id} direction="up" className={styles.testimonialCard}>
                <Quote className={styles.testimonialQuoteIcon} size={40} />
                <div className={styles.testimonialStars}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p className={styles.testimonialContent}>"{testimonial.content}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar} style={{ background: testimonial.avatarColor }}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                    <span className={styles.testimonialRole}>{testimonial.role}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <FadeIn direction="up" className={styles.faqHeader}>
            <span className={styles.faqBadge}><HelpCircle size={14} /> সাধারণ জিজ্ঞাসা</span>
            <h2 className={styles.faqTitle}>আপনার প্রশ্ন, আমাদের উত্তর</h2>
            <p className={styles.faqSubtitle}>আইকিউসি অ্যাকাডেমি সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ</p>
          </FadeIn>

          <StaggerContainer className={styles.faqList}>
            {mockFaq.map(faq => (
              <StaggerItem key={faq.id} direction="up" as="details" className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  <span>{faq.question}</span>
                  <ChevronDown className={styles.faqIcon} size={20} />
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className={styles.ctaSection}>
        <FadeIn direction="up" className={styles.ctaInner}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>দ্বীনি জ্ঞান অর্জনের পথে আপনার সঙ্গী</h2>
            <p className={styles.ctaDesc}>
              যেকোনো প্রশ্ন, পরামর্শ বা ভর্তির বিষয়ে জানতে সরাসরি আমাদের সাথে যোগাযোগ করুন। আমাদের সাপোর্ট টিম সবসময় আপনার সেবায় প্রস্তুত।
            </p>
            <div className={styles.ctaButtons}>
              <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                <MessageCircle size={20} /> হোয়াটসঅ্যাপে মেসেজ দিন
              </a>
              <a href="tel:+8801700000000" className={styles.callBtn}>
                <Phone size={20} /> সরাসরি কল করুন
              </a>
            </div>
          </div>
          <div className={styles.ctaDecorative}>
            <div className={styles.ctaCircle1}></div>
            <div className={styles.ctaCircle2}></div>
          </div>
        </FadeIn>
      </section>

      {/* Featured Highlight */}
      {latestNotice && (
        <section className={styles.highlightSection}>
          <FadeIn direction="up" className={styles.highlightCard}>
            <div className={styles.highlightContent}>
              <span className={styles.highlightBadge}>নতুন নোটিশ</span>
              <h2 className={styles.highlightTitle}>{latestNotice.title}</h2>
              <p className={styles.highlightDesc}>
                {latestNotice.body}
              </p>
            </div>
            <div>
              <Link href={latestNotice.link || '/courses'} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
                {latestNotice.linkText || 'বিস্তারিত জানুন'}
              </Link>
            </div>
          </FadeIn>
        </section>
      )}

    </div>
  );
}
