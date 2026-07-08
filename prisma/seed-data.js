const { PrismaClient } = require('@prisma/client');
const { hash } = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with placeholder content...\n');

  // ═══════════════════════════════════════════════════════════════
  // 1. INSTRUCTORS
  // ═══════════════════════════════════════════════════════════════
  console.log('👨‍🏫 Creating instructors...');
  const instructors = await Promise.all([
    prisma.instructor.create({
      data: {
        name: 'মাওলানা আবু তাহের',
        title: 'কুরআন বিভাগ প্রধান',
      }
    }),
    prisma.instructor.create({
      data: {
        name: 'উস্তাদ আব্দুর রহমান',
        title: 'হাদিস ও ফিকহ বিশেষজ্ঞ',
      }
    }),
    prisma.instructor.create({
      data: {
        name: 'মাওলানা ইব্রাহীম খলিল',
        title: 'আরবি ভাষা বিশেষজ্ঞ',
      }
    }),
    prisma.instructor.create({
      data: {
        name: 'উস্তাদা ফাতেমা খাতুন',
        title: 'ইসলামি ইতিহাস বিভাগ',
      }
    }),
  ]);
  console.log(`   ✅ ${instructors.length} instructors created`);

  // ═══════════════════════════════════════════════════════════════
  // 2. COURSES with MODULES and QUIZZES
  // ═══════════════════════════════════════════════════════════════
  console.log('📚 Creating courses with modules and quizzes...');

  // Course 1: Quran Basics (FREE)
  const course1 = await prisma.course.create({
    data: {
      title: 'কুরআন শিক্ষা — প্রাথমিক পর্যায়',
      description: 'কুরআন মাজীদ পড়ার মৌলিক নিয়মকানুন শিখুন। আরবি হরফ চেনা থেকে শুরু করে সহীহভাবে তিলাওয়াত করা পর্যন্ত এই কোর্সে শেখানো হবে। নতুনদের জন্য আদর্শ একটি কোর্স।',
      type: 'FREE',
      status: 'PUBLISHED',
      level: 'প্রাথমিক',
      duration: '৮ সপ্তাহ',
      language: 'বাংলা',
      certificate: true,
      instructorId: instructors[0].id,
      tags: ['কুরআন', 'তাজবীদ', 'প্রাথমিক'],
      features: ['ভিডিও লেসন', 'কুইজ', 'সার্টিফিকেট', 'লাইভ ক্লাস'],
      rating: 4.8,
      ratingCount: 124,
      enrolledCount: 356,
      modules: {
        create: [
          {
            title: 'আরবি হরফ পরিচিতি (আলিফ - যা)',
            order: 1,
            duration: '৪৫ মিনিট',
            contentType: 'TEXT',
            body: `# আরবি হরফ পরিচিতি

আরবি ভাষায় মোট ২৯টি হরফ রয়েছে। এই পাঠে আমরা প্রথম ১৫টি হরফ শিখব।

## হরফসমূহ
- **আলিফ (ا)** — এটি প্রথম হরফ
- **বা (ب)** — নিচে একটি নোকতা
- **তা (ت)** — উপরে দুইটি নোকতা
- **সা (ث)** — উপরে তিনটি নোকতা

## অনুশীলন
প্রতিটি হরফ কমপক্ষে ১০ বার লিখে অনুশীলন করুন। হরফের আকৃতি ও নোকতার অবস্থান মনে রাখুন।`,
            quizzes: {
              create: [
                {
                  question: 'আরবি ভাষায় মোট কতটি হরফ আছে?',
                  options: ['২৬টি', '২৮টি', '২৯টি', '৩০টি'],
                  correct: 2,
                  explanation: 'আরবি ভাষায় মোট ২৯টি হরফ রয়েছে।'
                },
                {
                  question: '"বা" হরফে নোকতা কোথায় থাকে?',
                  options: ['উপরে', 'নিচে', 'দুই পাশে', 'নোকতা নেই'],
                  correct: 1,
                  explanation: 'বা (ب) হরফের নিচে একটি নোকতা থাকে।'
                }
              ]
            }
          },
          {
            title: 'হরকত ও তানবীন',
            order: 2,
            duration: '৫০ মিনিট',
            contentType: 'TEXT',
            body: `# হরকত ও তানবীন

হরকত হলো আরবি হরফের উপর বা নিচে ব্যবহৃত চিহ্ন যা উচ্চারণ নির্দেশ করে।

## তিনটি মূল হরকত
1. **যবর (فَتحة)** — হরফের উপরে ছোট তির্যক রেখা — "আ" এর মতো উচ্চারণ
2. **যের (كَسرة)** — হরফের নিচে ছোট তির্যক রেখা — "ই" এর মতো উচ্চারণ
3. **পেশ (ضَمّة)** — হরফের উপরে ছোট "ও" আকৃতি — "উ" এর মতো উচ্চারণ

## তানবীন
তানবীন হলো দ্বিগুণ হরকত: যবর তানবীন, যের তানবীন, পেশ তানবীন।`,
            quizzes: {
              create: [
                {
                  question: 'মূল হরকত কতটি?',
                  options: ['২টি', '৩টি', '৪টি', '৫টি'],
                  correct: 1,
                  explanation: 'মূল হরকত ৩টি: যবর, যের ও পেশ।'
                }
              ]
            }
          },
          {
            title: 'জোড়া হরফ ও যুক্তাক্ষর',
            order: 3,
            duration: '৪০ মিনিট',
            contentType: 'TEXT',
            body: '# জোড়া হরফ ও যুক্তাক্ষর\n\nআরবি লেখায় হরফগুলো একটির সাথে আরেকটি যুক্ত হয়ে শব্দ গঠন করে। এই পাঠে আমরা শিখব কিভাবে হরফগুলো শব্দের শুরুতে, মাঝে ও শেষে বিভিন্ন আকৃতি ধারণ করে।'
          },
          {
            title: 'সূরা ফাতিহা তিলাওয়াত',
            order: 4,
            duration: '৬০ মিনিট',
            contentType: 'TEXT',
            body: '# সূরা আল-ফাতিহা\n\nসূরা ফাতিহা কুরআনের প্রথম সূরা এবং নামাযের অপরিহার্য অংশ। এই পাঠে আমরা সূরা ফাতিহার সঠিক উচ্চারণ, অর্থ ও তাফসীর শিখব।\n\n## আয়াত ১\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n\nপরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি।'
          },
        ]
      }
    }
  });

  // Course 2: Hadith Studies (FREE)
  const course2 = await prisma.course.create({
    data: {
      title: 'হাদিস শিক্ষা — নববী চল্লিশ',
      description: 'ইমাম নববী (রহ.) সংকলিত বিখ্যাত চল্লিশ হাদিসের বাংলা ব্যাখ্যা ও বিশ্লেষণ। প্রতিটি হাদিসের পটভূমি, শিক্ষা ও দৈনন্দিন জীবনে প্রয়োগ শেখানো হবে।',
      type: 'FREE',
      status: 'PUBLISHED',
      level: 'মধ্যম',
      duration: '১০ সপ্তাহ',
      language: 'বাংলা',
      certificate: true,
      instructorId: instructors[1].id,
      tags: ['হাদিস', 'নববী', 'সুন্নাহ'],
      features: ['ভিডিও লেসন', 'কুইজ', 'পিডিএফ নোট'],
      rating: 4.9,
      ratingCount: 89,
      enrolledCount: 245,
      modules: {
        create: [
          {
            title: 'হাদিস ১: নিয়তের গুরুত্ব',
            order: 1,
            duration: '৩০ মিনিট',
            contentType: 'TEXT',
            body: `# হাদিস ১: নিয়তের গুরুত্ব

> "সকল কাজ নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তাই পাবে যা সে নিয়ত করেছে।"
> — বুখারী ও মুসলিম

## ব্যাখ্যা
এই হাদিসটি ইসলামের সবচেয়ে গুরুত্বপূর্ণ হাদিসগুলোর একটি। ইমাম বুখারী তাঁর সহীহ গ্রন্থটি এই হাদিস দিয়ে শুরু করেছেন।

## শিক্ষা
- প্রতিটি কাজে আল্লাহর সন্তুষ্টির নিয়ত করা
- দুনিয়াবি কাজকেও ইবাদতে রূপান্তরিত করা যায় সঠিক নিয়তের মাধ্যমে`,
            quizzes: {
              create: [
                {
                  question: 'এই হাদিসটি কোন কিতাবে বর্ণিত?',
                  options: ['শুধু বুখারী', 'শুধু মুসলিম', 'বুখারী ও মুসলিম', 'তিরমিযী'],
                  correct: 2,
                  explanation: 'এই হাদিসটি বুখারী ও মুসলিম উভয় গ্রন্থে বর্ণিত।'
                }
              ]
            }
          },
          {
            title: 'হাদিস ২: ইসলামের স্তম্ভ',
            order: 2,
            duration: '৩৫ মিনিট',
            contentType: 'TEXT',
            body: '# হাদিস ২: ইসলামের স্তম্ভ\n\nএই হাদিসে জিবরীল (আ.) মানুষের রূপে এসে রাসূলুল্লাহ (সা.) কে ইসলাম, ঈমান ও ইহসান সম্পর্কে প্রশ্ন করেছিলেন।'
          },
          {
            title: 'হাদিস ৩: ইসলামের পাঁচ ভিত্তি',
            order: 3,
            duration: '৩০ মিনিট',
            contentType: 'TEXT',
            body: '# হাদিস ৩: ইসলামের পাঁচ ভিত্তি\n\nইসলামের পাঁচটি ভিত্তি: কালেমা, নামায, রোযা, যাকাত ও হজ্জ।'
          }
        ]
      }
    }
  });

  // Course 3: Arabic Language (PAID)
  const course3 = await prisma.course.create({
    data: {
      title: 'আরবি ভাষা শিক্ষা — ব্যাসিক থেকে ইন্টারমিডিয়েট',
      description: 'আরবি ভাষায় কথা বলা, লেখা ও পড়ার দক্ষতা অর্জন করুন। দৈনন্দিন কথোপকথন থেকে শুরু করে কুরআনের ভাষা বোঝা পর্যন্ত — এই কোর্সে সবকিছু শেখানো হবে।',
      type: 'PAID',
      price: 1500,
      originalPrice: 2500,
      status: 'PUBLISHED',
      level: 'প্রাথমিক - মধ্যম',
      duration: '১২ সপ্তাহ',
      language: 'বাংলা',
      certificate: true,
      liveSessions: true,
      liveSessionCount: 12,
      instructorId: instructors[2].id,
      tags: ['আরবি', 'ভাষা', 'গ্রামার'],
      features: ['লাইভ ক্লাস', 'ভিডিও লেসন', 'কুইজ', 'সার্টিফিকেট', 'পিডিএফ নোট'],
      rating: 4.7,
      ratingCount: 67,
      enrolledCount: 189,
      modules: {
        create: [
          { title: 'আরবি বর্ণমালা ও উচ্চারণ', order: 1, duration: '৬০ মিনিট', contentType: 'TEXT', body: 'আরবি বর্ণমালা ও সঠিক উচ্চারণ পদ্ধতি শিখুন।' },
          { title: 'আরবি সর্বনাম ও ক্রিয়াপদ', order: 2, duration: '৫০ মিনিট', contentType: 'TEXT', body: 'আরবি সর্বনাম ও ক্রিয়াপদের মৌলিক ধারণা।' },
          { title: 'দৈনন্দিন আরবি কথোপকথন', order: 3, duration: '৪৫ মিনিট', contentType: 'TEXT', body: 'দৈনন্দিন জীবনে ব্যবহৃত আরবি বাক্য ও কথোপকথন শিখুন।' },
          { title: 'কুরআনিক আরবি পরিচিতি', order: 4, duration: '৫৫ মিনিট', contentType: 'TEXT', body: 'কুরআনে ব্যবহৃত আরবি শব্দভাণ্ডার ও বাক্য গঠন।' },
        ]
      }
    }
  });

  // Course 4: Islamic History (FREE)
  const course4 = await prisma.course.create({
    data: {
      title: 'সীরাতুন্নবী (সা.) — নবীজীর জীবনী',
      description: 'প্রিয় নবী হযরত মুহাম্মদ (সা.) এর জীবনী বিস্তারিতভাবে জানুন। জন্ম থেকে ওফাত পর্যন্ত তাঁর জীবনের প্রতিটি গুরুত্বপূর্ণ ঘটনা ও শিক্ষা আলোচনা করা হবে।',
      type: 'FREE',
      status: 'PUBLISHED',
      level: 'সকল স্তর',
      duration: '১৫ সপ্তাহ',
      language: 'বাংলা',
      certificate: true,
      instructorId: instructors[3].id,
      tags: ['সীরাত', 'ইতিহাস', 'নবীজী'],
      features: ['ভিডিও লেসন', 'পিডিএফ নোট', 'কুইজ'],
      rating: 4.9,
      ratingCount: 203,
      enrolledCount: 512,
      modules: {
        create: [
          { title: 'জাহিলিয়া যুগের আরব সমাজ', order: 1, duration: '৪০ মিনিট', contentType: 'TEXT', body: 'নবীজীর আগমনের পূর্বে আরব সমাজের অবস্থা কেমন ছিল তা জানুন।' },
          { title: 'নবীজীর জন্ম ও শৈশবকাল', order: 2, duration: '৩৫ মিনিট', contentType: 'TEXT', body: 'রাসূলুল্লাহ (সা.) এর জন্ম, দুধমা হালিমার ঘরে লালন-পালন ও শৈশবকালের ঘটনাবলী।' },
          { title: 'নবুওয়াত প্রাপ্তি ও প্রথম ওহী', order: 3, duration: '৪৫ মিনিট', contentType: 'TEXT', body: 'হেরা গুহায় প্রথম ওহী নাযিল ও ইসলামের প্রাথমিক দাওয়াত।' },
          { title: 'মক্কী জীবন ও হিজরত', order: 4, duration: '৫০ মিনিট', contentType: 'TEXT', body: 'মক্কায় দাওয়াত, কুরাইশদের বিরোধিতা ও মদীনায় হিজরত।' },
          { title: 'মাদানী জীবন ও ইসলামী রাষ্ট্র', order: 5, duration: '৫৫ মিনিট', contentType: 'TEXT', body: 'মদীনায় ইসলামী রাষ্ট্র প্রতিষ্ঠা, মদীনা সনদ ও সামাজিক সংস্কার।' },
        ]
      }
    }
  });

  // Course 5: Fiqh (PAID)
  const course5 = await prisma.course.create({
    data: {
      title: 'ফিকহুল ইবাদাত — নামায, রোযা ও যাকাত',
      description: 'ইবাদতের ফিকহী মাসায়েল বিস্তারিত জানুন। নামাযের নিয়ম, রোযার মাসায়েল ও যাকাতের হিসাব — সবকিছু হানাফী মাযহাব অনুযায়ী শেখানো হবে।',
      type: 'PAID',
      price: 999,
      originalPrice: 1999,
      status: 'PUBLISHED',
      level: 'মধ্যম',
      duration: '৮ সপ্তাহ',
      language: 'বাংলা',
      certificate: true,
      instructorId: instructors[1].id,
      tags: ['ফিকহ', 'নামায', 'রোযা', 'যাকাত'],
      features: ['ভিডিও লেসন', 'কুইজ', 'সার্টিফিকেট', 'পিডিএফ নোট'],
      rating: 4.6,
      ratingCount: 45,
      enrolledCount: 134,
      modules: {
        create: [
          { title: 'তাহারাত — পবিত্রতা অর্জন', order: 1, duration: '৪০ মিনিট', contentType: 'TEXT', body: 'অযু, গোসল ও তায়াম্মুমের বিস্তারিত নিয়মাবলী।' },
          { title: 'সালাত — নামাযের বিধান', order: 2, duration: '৫৫ মিনিট', contentType: 'TEXT', body: 'পাঁচ ওয়াক্ত নামাযের সঠিক নিয়ম, ওয়াজিব ও সুন্নাত।' },
          { title: 'সাওম — রোযার মাসায়েল', order: 3, duration: '৪৫ মিনিট', contentType: 'TEXT', body: 'রমজানের রোযার ফরয, মাকরূহ ও রোযা ভাঙার কারণসমূহ।' },
        ]
      }
    }
  });

  console.log(`   ✅ 5 courses created with modules and quizzes`);

  // ═══════════════════════════════════════════════════════════════
  // 3. PROJECTS (for Donations)
  // ═══════════════════════════════════════════════════════════════
  console.log('🌟 Creating projects...');
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'মসজিদ নির্মাণ প্রকল্প — সিলেট',
        description: 'সিলেটের একটি প্রত্যন্ত গ্রামে মসজিদ নির্মাণের জন্য অনুদান সংগ্রহ করা হচ্ছে। বর্তমানে ৫০০ পরিবার খোলা আকাশের নিচে নামায আদায় করে।',
        targetAmount: 500000,
        raisedAmount: 234500,
        icon: '🕌',
        category: 'মসজিদ',
        location: 'সিলেট, বাংলাদেশ',
        status: 'ACTIVE',
        donorCount: 45,
      }
    }),
    prisma.project.create({
      data: {
        title: 'এতিমখানা সম্প্রসারণ — রাজশাহী',
        description: 'রাজশাহীতে ১৫০ জন এতিম শিশুর জন্য এতিমখানা সম্প্রসারণ প্রকল্প। নতুন শ্রেণীকক্ষ, লাইব্রেরি ও কম্পিউটার ল্যাব নির্মাণ করা হবে।',
        targetAmount: 300000,
        raisedAmount: 178000,
        icon: '🏫',
        category: 'শিক্ষা',
        location: 'রাজশাহী, বাংলাদেশ',
        status: 'ACTIVE',
        donorCount: 32,
      }
    }),
    prisma.project.create({
      data: {
        title: 'টিউবওয়েল স্থাপন — বরিশাল',
        description: 'বরিশালের ৫টি গ্রামে বিশুদ্ধ পানির জন্য গভীর নলকূপ স্থাপন প্রকল্প। প্রতিটি নলকূপ ২০০+ পরিবারকে সুপেয় পানি সরবরাহ করবে।',
        targetAmount: 150000,
        raisedAmount: 150000,
        icon: '💧',
        category: 'পানি',
        location: 'বরিশাল, বাংলাদেশ',
        status: 'COMPLETED',
        donorCount: 67,
      }
    }),
    prisma.project.create({
      data: {
        title: 'রমজান ফুড প্যাক — সারাদেশ',
        description: 'আসন্ন রমজানে দরিদ্র পরিবারগুলোর জন্য খাদ্যসামগ্রী বিতরণ করা হবে। প্রতিটি প্যাকে চাল, ডাল, তেল, চিনি ও খেজুর থাকবে।',
        targetAmount: 200000,
        raisedAmount: 56000,
        icon: '🍽️',
        category: 'খাদ্য',
        location: 'সারাদেশ',
        status: 'ACTIVE',
        donorCount: 23,
      }
    }),
  ]);
  console.log(`   ✅ ${projects.length} projects created`);

  // ═══════════════════════════════════════════════════════════════
  // 4. NOTICES
  // ═══════════════════════════════════════════════════════════════
  console.log('📢 Creating notices...');
  const notices = await Promise.all([
    prisma.notice.create({
      data: {
        title: 'নতুন কোর্স: সীরাতুন্নবী (সা.) চালু হয়েছে!',
        body: 'প্রিয় শিক্ষার্থীরা, আমাদের নতুন কোর্স "সীরাতুন্নবী (সা.) — নবীজীর জীবনী" চালু হয়েছে। এখনই ভর্তি হোন এবং নবীজীর জীবনী সম্পর্কে বিস্তারিত জানুন।',
        link: '/courses',
        linkText: 'কোর্স দেখুন',
        important: true,
      }
    }),
    prisma.notice.create({
      data: {
        title: 'রমজান বিশেষ কুইজ প্রতিযোগিতা',
        body: 'আসন্ন রমজান উপলক্ষে বিশেষ কুইজ প্রতিযোগিতার আয়োজন করা হয়েছে। বিজয়ীদের জন্য আকর্ষণীয় পুরস্কার রয়েছে। সকলকে অংশগ্রহণের আমন্ত্রণ জানানো যাচ্ছে।',
        important: false,
      }
    }),
    prisma.notice.create({
      data: {
        title: 'সার্ভার আপডেট: রক্ষণাবেক্ষণ কাজ',
        body: 'আগামী শুক্রবার রাত ১২টা থেকে ভোর ৬টা পর্যন্ত সার্ভার রক্ষণাবেক্ষণের কাজ চলবে। এই সময়ে ওয়েবসাইটে সাময়িক সমস্যা হতে পারে।',
        important: false,
      }
    }),
    prisma.notice.create({
      data: {
        title: 'মসজিদ নির্মাণ প্রকল্পে অনুদানের আবেদন',
        body: 'সিলেটে মসজিদ নির্মাণ প্রকল্পে এখনো আর্থিক সহায়তা প্রয়োজন। আপনার ছোট অনুদানও বড় পরিবর্তন আনতে পারে।',
        link: '/projects',
        linkText: 'অনুদান করুন',
        important: true,
      }
    }),
  ]);
  console.log(`   ✅ ${notices.length} notices created`);

  // ═══════════════════════════════════════════════════════════════
  // 5. CONTENT (Articles)
  // ═══════════════════════════════════════════════════════════════
  console.log('📝 Creating content articles...');
  const contents = await Promise.all([
    prisma.content.create({
      data: {
        title: 'ফজরের নামাযের ফযীলত ও গুরুত্ব',
        type: 'ARTICLE',
        body: `# ফজরের নামাযের ফযীলত ও গুরুত্ব

ফজরের নামায ইসলামের পাঁচটি ফরয নামাযের মধ্যে অন্যতম গুরুত্বপূর্ণ। রাসূলুল্লাহ (সা.) বলেছেন:

> "যে ব্যক্তি ফজরের নামায জামাতে আদায় করল, সে যেন সারা রাত নামায পড়ল।" — মুসলিম

## ফজরের নামাযের কিছু বিশেষ ফযীলত

1. **আল্লাহর নিরাপত্তায় থাকা** — যে ব্যক্তি ফজরের নামায পড়ে, সে আল্লাহর যিম্মায় থাকে।
2. **জান্নাতের সুসংবাদ** — ফজর ও আসরের নামায নিয়মিত আদায়কারীর জন্য জান্নাতের সুসংবাদ।
3. **নূরের প্রতিশ্রুতি** — কিয়ামতের দিন অন্ধকারে নূর দেওয়া হবে।

## কিভাবে ফজরে ঘুম থেকে উঠবেন?

- রাতে তাড়াতাড়ি ঘুমান
- অ্যালার্ম দিন
- ঘুমানোর আগে দোয়া পড়ুন
- আল্লাহর কাছে সাহায্য চান`,
        tags: ['নামায', 'ফজর', 'ফযীলত'],
        readingTime: '৫ মিনিট',
        published: true,
      }
    }),
    prisma.content.create({
      data: {
        title: 'কুরআন মুখস্থ করার কার্যকর পদ্ধতি',
        type: 'ARTICLE',
        body: `# কুরআন মুখস্থ করার কার্যকর পদ্ধতি

কুরআন হিফয করা একটি মহান ইবাদত। সঠিক পদ্ধতি অনুসরণ করলে যেকেউ কুরআন মুখস্থ করতে পারে।

## ধাপে ধাপে পদ্ধতি

### ১. নিয়ত ঠিক করুন
সবার আগে আল্লাহর সন্তুষ্টির জন্য নিয়ত করুন।

### ২. প্রতিদিন নির্দিষ্ট সময় বরাদ্দ করুন
ফজরের পর সবচেয়ে ভালো সময়। কমপক্ষে ৩০ মিনিট বরাদ্দ রাখুন।

### ৩. ছোট ছোট অংশে ভাগ করুন
একবারে বেশি মুখস্থ করার চেষ্টা করবেন না। দিনে ৩-৫ আয়াত যথেষ্ট।

### ৪. বারবার পুনরাবৃত্তি করুন
নতুন মুখস্থের সাথে পুরানো অংশও রিভিশন দিন।`,
        tags: ['কুরআন', 'হিফয', 'টিপস'],
        readingTime: '৭ মিনিট',
        published: true,
      }
    }),
    prisma.content.create({
      data: {
        title: 'রমজানের প্রস্তুতি: এখন থেকেই শুরু করুন',
        type: 'ARTICLE',
        body: `# রমজানের প্রস্তুতি

রমজান আসার আগেই প্রস্তুতি নেওয়া সুন্নত। শাবান মাস থেকেই রোযা ও ইবাদতের অভ্যাস গড়ে তুলুন।

## করণীয় তালিকা
- নফল রোযা রাখা শুরু করুন
- কুরআন তিলাওয়াতের পরিমাণ বাড়ান
- তাহাজ্জুদের অভ্যাস করুন
- দান-সদকা বাড়ান`,
        tags: ['রমজান', 'প্রস্তুতি', 'ইবাদত'],
        readingTime: '৪ মিনিট',
        published: true,
      }
    }),
  ]);
  console.log(`   ✅ ${contents.length} content articles created`);

  // ═══════════════════════════════════════════════════════════════
  // 6. GALLERY ITEMS
  // ═══════════════════════════════════════════════════════════════
  console.log('🖼️ Creating gallery items...');
  const galleryItems = await Promise.all([
    prisma.galleryItem.create({
      data: {
        title: 'কুরআন প্রতিযোগিতা ২০২৫',
        type: 'event',
        imageUrl: '/images/gallery_quran_competition_1782147853584.png',
        date: new Date('2025-03-15'),
      }
    }),
    prisma.galleryItem.create({
      data: {
        title: 'ইফতার মাহফিল',
        type: 'event',
        imageUrl: '/images/gallery_iftar_1782147866691.png',
        date: new Date('2025-03-20'),
      }
    }),
    prisma.galleryItem.create({
      data: {
        title: 'অনলাইন ক্লাস সেশন',
        type: 'class',
        imageUrl: '/images/gallery_online_class_1782147899608.png',
        date: new Date('2025-04-01'),
      }
    }),
    prisma.galleryItem.create({
      data: {
        title: 'মসজিদ নির্মাণ প্রকল্প',
        type: 'project',
        imageUrl: '/images/gallery_mosque_project_1782147841193.png',
        date: new Date('2025-02-10'),
      }
    }),
    prisma.galleryItem.create({
      data: {
        title: 'এতিমখানা পরিদর্শন',
        type: 'project',
        imageUrl: '/images/gallery_orphan_school_1782147887481.png',
        date: new Date('2025-01-25'),
      }
    }),
    prisma.galleryItem.create({
      data: {
        title: 'টিউবওয়েল স্থাপন — বরিশাল',
        type: 'project',
        imageUrl: '/images/gallery_well_project_1782147913086.png',
        date: new Date('2025-05-05'),
      }
    }),
  ]);
  console.log(`   ✅ ${galleryItems.length} gallery items created`);

  // ═══════════════════════════════════════════════════════════════
  // 7. SAMPLE STUDENTS
  // ═══════════════════════════════════════════════════════════════
  console.log('👨‍🎓 Creating sample students...');
  const password = await hash('Student@123');

  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: 'আব্দুল্লাহ আল মামুন',
        email: 'abdullah@example.com',
        mobile: '01712345678',
        whatsapp: '01712345678',
        passwordHash: password,
        role: 'STUDENT',
        status: 'ACTIVE',
        institution: 'ঢাকা বিশ্ববিদ্যালয়',
        division: 'ঢাকা',
        district: 'ঢাকা',
        sscYear: '2020',
        sscBoard: 'Dhaka',
        sscGpa: '5.00',
        totalPoints: 150,
        currentStreak: 7,
      }
    }),
    prisma.user.create({
      data: {
        name: 'ফাতেমা আক্তার',
        email: 'fatema@example.com',
        mobile: '01812345678',
        whatsapp: '01812345678',
        passwordHash: password,
        role: 'STUDENT',
        status: 'ACTIVE',
        institution: 'রাজশাহী বিশ্ববিদ্যালয়',
        division: 'রাজশাহী',
        district: 'রাজশাহী',
        sscYear: '2021',
        sscBoard: 'Rajshahi',
        sscGpa: '4.83',
        totalPoints: 90,
        currentStreak: 3,
      }
    }),
    prisma.user.create({
      data: {
        name: 'মুহাম্মদ ইউসুফ',
        email: 'yusuf@example.com',
        mobile: '01912345678',
        passwordHash: password,
        role: 'STUDENT',
        status: 'PENDING',
        institution: 'চট্টগ্রাম বিশ্ববিদ্যালয়',
        division: 'চট্টগ্রাম',
        district: 'চট্টগ্রাম',
        sscYear: '2022',
        sscBoard: 'Chittagong',
        sscGpa: '4.56',
      }
    }),
  ]);
  console.log(`   ✅ ${students.length} sample students created`);

  // ═══════════════════════════════════════════════════════════════
  // 8. ENROLLMENTS (for active students)
  // ═══════════════════════════════════════════════════════════════
  console.log('📋 Creating enrollments...');
  await prisma.enrollment.create({
    data: {
      userId: students[0].id,
      courseId: course1.id,
      status: 'ACTIVE',
      progress: 50,
      completedModules: 2,
    }
  });
  await prisma.enrollment.create({
    data: {
      userId: students[0].id,
      courseId: course2.id,
      status: 'ACTIVE',
      progress: 33,
      completedModules: 1,
    }
  });
  await prisma.enrollment.create({
    data: {
      userId: students[1].id,
      courseId: course1.id,
      status: 'COMPLETED',
      progress: 100,
      completedModules: 4,
      completedAt: new Date(),
    }
  });
  await prisma.enrollment.create({
    data: {
      userId: students[1].id,
      courseId: course4.id,
      status: 'ACTIVE',
      progress: 20,
      completedModules: 1,
    }
  });
  console.log('   ✅ 4 enrollments created');

  // ═══════════════════════════════════════════════════════════════
  // 9. DONATIONS
  // ═══════════════════════════════════════════════════════════════
  console.log('💰 Creating sample donations...');
  await Promise.all([
    prisma.donation.create({
      data: {
        userId: students[0].id,
        projectId: projects[0].id,
        name: 'আব্দুল্লাহ আল মামুন',
        mobile: '01712345678',
        amount: 5000,
        txId: 'BK2025070801',
        method: 'BKASH',
        status: 'VERIFIED',
        verifiedAt: new Date(),
      }
    }),
    prisma.donation.create({
      data: {
        userId: students[1].id,
        projectId: projects[1].id,
        name: 'ফাতেমা আক্তার',
        mobile: '01812345678',
        amount: 2000,
        txId: 'NG2025070802',
        method: 'NAGAD',
        status: 'VERIFIED',
        verifiedAt: new Date(),
      }
    }),
    prisma.donation.create({
      data: {
        name: 'বেনামী দাতা',
        mobile: '01600000001',
        amount: 10000,
        txId: 'BK2025070803',
        method: 'BKASH',
        status: 'PENDING',
        projectId: projects[0].id,
      }
    }),
  ]);
  console.log('   ✅ 3 donations created');

  // ═══════════════════════════════════════════════════════════════
  console.log('\n✅ Database seeding completed successfully!');
  console.log('─────────────────────────────────────');
  console.log('   📚 5 Courses (with modules & quizzes)');
  console.log('   👨‍🏫 4 Instructors');
  console.log('   🌟 4 Projects');
  console.log('   📢 4 Notices');
  console.log('   📝 3 Content Articles');
  console.log('   🖼️  6 Gallery Items');
  console.log('   👨‍🎓 3 Sample Students');
  console.log('   📋 4 Enrollments');
  console.log('   💰 3 Donations');
  console.log('─────────────────────────────────────');
  console.log('\n🔑 Sample student login:');
  console.log('   Email:    abdullah@example.com');
  console.log('   Password: Student@123\n');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
