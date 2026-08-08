const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding IQC Academy database...\n');

  // ─────────────────────────────────────────────
  // 1. Hash a common password for all test users
  // ─────────────────────────────────────────────
  const testPasswordHash = await argon2.hash('Student@12345');

  // ─────────────────────────────────────────────
  // 2. Instructors
  // ─────────────────────────────────────────────
  console.log('Creating instructors...');
  const instructors = await Promise.all([
    prisma.instructor.upsert({
      where: { id: 'inst-1' },
      update: {},
      create: {
        id: 'inst-1',
        name: 'শায়খ আবু বকর মুহাম্মাদ যাকারিয়া',
        title: 'প্রধান শিক্ষক, আইকিউসি একাডেমি | ইসলামিক স্কলার',
      },
    }),
    prisma.instructor.upsert({
      where: { id: 'inst-2' },
      update: {},
      create: {
        id: 'inst-2',
        name: 'উস্তাদ মোহাম্মদ ইলিয়াস মাদানী',
        title: 'হিফজুল কুরআন বিভাগ প্রধান',
      },
    }),
    prisma.instructor.upsert({
      where: { id: 'inst-3' },
      update: {},
      create: {
        id: 'inst-3',
        name: 'উস্তাদ ড. আব্দুল্লাহ আল-মামুন',
        title: 'আকীদা ও ফিকহ বিশেষজ্ঞ',
      },
    }),
  ]);

  // ─────────────────────────────────────────────
  // 3. Courses
  // ─────────────────────────────────────────────
  console.log('Creating courses...');

  const course1 = await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      title: 'কুরআন তিলাওয়াত ও তাজবীদ - বেসিক থেকে অ্যাডভান্সড',
      description: 'তাজবীদের নিয়ম-কানুন সহ সহীহ কুরআন তিলাওয়াত শিখুন। মাখরাজ, সিফাত ও উচ্চারণের সূক্ষ্ম বিষয়গুলো বাংলায় বিস্তারিতভাবে শেখানো হবে।',
      type: 'FREE',
      status: 'PUBLISHED',
      level: 'বেসিক',
      duration: '৪৮ ঘণ্টা',
      language: 'বাংলা',
      certificate: true,
      instructorId: 'inst-2',
      tags: ['কুরআন', 'তাজবীদ', 'তিলাওয়াত', 'বেসিক'],
      features: ['লাইভ ক্লাস', 'সার্টিফিকেট', 'প্রশ্নোত্তর পর্ব'],
      rating: 4.8,
      ratingCount: 142,
      enrolledCount: 320,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-2' },
    update: {},
    create: {
      id: 'course-2',
      title: 'ইসলামিক আকীদা ও বিশ্বাস - সম্পূর্ণ কোর্স',
      description: 'সঠিক ইসলামিক আকীদা সম্পর্কে বিস্তারিত জানুন। তাওহীদ, রিসালাত, আখিরাত এবং ঈমানের মূল বিষয়গুলো দলিলভিত্তিক আলোচনা করা হবে।',
      type: 'FREE',
      status: 'PUBLISHED',
      level: 'মধ্যবর্তী',
      duration: '৩৬ ঘণ্টা',
      language: 'বাংলা',
      certificate: true,
      instructorId: 'inst-3',
      tags: ['আকীদা', 'তাওহীদ', 'ঈমান'],
      features: ['ভিডিও লেকচার', 'পিডিএফ নোট', 'কুইজ'],
      rating: 4.9,
      ratingCount: 89,
      enrolledCount: 215,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: 'course-3' },
    update: {},
    create: {
      id: 'course-3',
      title: 'ফিকহুল ইবাদাত - নামাজ, রোজা, যাকাত ও হজ',
      description: 'ইসলামের চার মূল ইবাদত সম্পর্কে বিস্তারিত ফিকহী আলোচনা। হানাফি মাযহাব অনুযায়ী মাসআলা-মাসায়েল সহ পূর্ণাঙ্গ গাইড।',
      type: 'PAID',
      price: 1200,
      originalPrice: 1800,
      status: 'PUBLISHED',
      level: 'মধ্যবর্তী',
      duration: '৬০ ঘণ্টা',
      language: 'বাংলা',
      certificate: true,
      liveSessions: true,
      liveSessionCount: 8,
      instructorId: 'inst-1',
      tags: ['ফিকহ', 'নামাজ', 'রোজা', 'যাকাত', 'হজ'],
      features: ['লাইভ ক্লাস', 'সার্টিফিকেট', 'ব্যক্তিগত মেন্টরিং', 'প্রিন্টেড নোট'],
      rating: 4.7,
      ratingCount: 63,
      enrolledCount: 98,
    },
  });

  const course4 = await prisma.course.upsert({
    where: { id: 'course-4' },
    update: {},
    create: {
      id: 'course-4',
      title: 'হাদীস শাস্ত্র - উলুমুল হাদীস পরিচিতি',
      description: 'হাদীস বিজ্ঞানের মূলনীতি, হাদীসের শ্রেণিবিভাগ, মুহাদ্দিসীনদের পরিচয় এবং সিহাহ সিত্তার সংক্ষিপ্ত পরিচয় সম্পর্কে বিস্তারিত আলোচনা।',
      type: 'FREE',
      status: 'PUBLISHED',
      level: 'অ্যাডভান্সড',
      duration: '৪০ ঘণ্টা',
      language: 'বাংলা',
      certificate: true,
      instructorId: 'inst-1',
      tags: ['হাদীস', 'উলুমুল হাদীস', 'অ্যাডভান্সড'],
      features: ['ভিডিও লেকচার', 'পিডিএফ নোট', 'ফাইনাল পরীক্ষা'],
      rating: 4.6,
      ratingCount: 47,
      enrolledCount: 130,
    },
  });

  // ─────────────────────────────────────────────
  // 4. Subjects & Modules for Course 1
  // ─────────────────────────────────────────────
  console.log('Creating subjects & modules for Course 1...');

  const subj1 = await prisma.subject.upsert({
    where: { id: 'subj-1-1' },
    update: {},
    create: {
      id: 'subj-1-1',
      courseId: 'course-1',
      title: 'মাখরাজুল হুরূফ - হরফের উচ্চারণস্থান',
      description: 'আরবি হরফগুলোর সঠিক উচ্চারণস্থান এবং উচ্চারণ পদ্ধতি',
      order: 0,
      finalExamEnabled: true,
      finalExamPassMark: 60,
      finalExamDisplayCount: 10,
    },
  });

  const subj2 = await prisma.subject.upsert({
    where: { id: 'subj-1-2' },
    update: {},
    create: {
      id: 'subj-1-2',
      courseId: 'course-1',
      title: 'সিফাতুল হুরূফ - হরফের গুণাবলী',
      description: 'আরবি হরফের বৈশিষ্ট্য ও সিফাত সম্পর্কে বিস্তারিত',
      order: 1,
      finalExamEnabled: true,
      finalExamPassMark: 60,
      finalExamDisplayCount: 10,
    },
  });

  const subj3 = await prisma.subject.upsert({
    where: { id: 'subj-1-3' },
    update: {},
    create: {
      id: 'subj-1-3',
      courseId: 'course-1',
      title: 'মাদ্দ ও গুন্নাহ',
      description: 'মাদ্দের প্রকারভেদ এবং গুন্নার নিয়মকানুন',
      order: 2,
      finalExamEnabled: false,
    },
  });

  // Modules for Subject 1
  await prisma.module.upsert({ where: { id: 'mod-1-1-1' }, update: {}, create: { id: 'mod-1-1-1', subjectId: 'subj-1-1', title: 'মাখরাজ পরিচিতি ও গুরুত্ব', order: 0, contentType: 'VIDEO', duration: '৪৫ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'এই ক্লাসে আমরা মাখরাজুল হুরূফের গুরুত্ব এবং এর মূল ধারণা সম্পর্কে আলোচনা করব।', quizPassMark: 70, quizDisplayCount: 5 } });
  await prisma.module.upsert({ where: { id: 'mod-1-1-2' }, update: {}, create: { id: 'mod-1-1-2', subjectId: 'subj-1-1', title: 'হলকি হরফ - গলার হরফ', order: 1, contentType: 'VIDEO', duration: '৫০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'আলিফ, হা, খা, আইন, গাইন, হা — এই ৬টি হলকি হরফের উচ্চারণ পদ্ধতি শেখানো হবে।', quizPassMark: 70, quizDisplayCount: 5 } });
  await prisma.module.upsert({ where: { id: 'mod-1-1-3' }, update: {}, create: { id: 'mod-1-1-3', subjectId: 'subj-1-1', title: 'লাহায়ী হরফ - জিভের হরফ', order: 2, contentType: 'VIDEO', duration: '৫৫ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'জিভ থেকে উচ্চারিত হরফগুলোর বিস্তারিত।', quizPassMark: 70, quizDisplayCount: 5 } });
  await prisma.module.upsert({ where: { id: 'mod-1-1-4' }, update: {}, create: { id: 'mod-1-1-4', subjectId: 'subj-1-1', title: 'শাফাওয়ী হরফ - ঠোঁটের হরফ', order: 3, contentType: 'TEXT', duration: '৩০ মিনিট', body: 'ব, মীম, ওয়াও, ফা — ঠোঁট থেকে উচ্চারিত হরফ।', quizPassMark: 70, quizDisplayCount: 5 } });

  // Modules for Subject 2
  await prisma.module.upsert({ where: { id: 'mod-1-2-1' }, update: {}, create: { id: 'mod-1-2-1', subjectId: 'subj-1-2', title: 'সিফাত পরিচিতি', order: 0, contentType: 'VIDEO', duration: '৪০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'হরফের গুণাবলী বা সিফাতের পরিচয়।', quizPassMark: 70, quizDisplayCount: 5 } });
  await prisma.module.upsert({ where: { id: 'mod-1-2-2' }, update: {}, create: { id: 'mod-1-2-2', subjectId: 'subj-1-2', title: 'লাযিম সিফাত ও আরিজ সিফাত', order: 1, contentType: 'VIDEO', duration: '৪৫ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'স্থায়ী ও অস্থায়ী সিফাতের পার্থক্য।', quizPassMark: 70, quizDisplayCount: 5 } });
  await prisma.module.upsert({ where: { id: 'mod-1-2-3' }, update: {}, create: { id: 'mod-1-2-3', subjectId: 'subj-1-2', title: 'ইদগাম ও ইখফা', order: 2, contentType: 'PDF', duration: '৩৫ মিনিট', pdfUrl: '/docs/sample.pdf', body: 'ইদগাম ও ইখফার বিস্তারিত নিয়মাবলী।', quizPassMark: 70, quizDisplayCount: 5 } });

  // Modules for Subject 3
  await prisma.module.upsert({ where: { id: 'mod-1-3-1' }, update: {}, create: { id: 'mod-1-3-1', subjectId: 'subj-1-3', title: 'মাদ্দের প্রকারভেদ', order: 0, contentType: 'VIDEO', duration: '৫০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'মাদ্দে আসলি, মাদ্দে ফারী সহ সকল মাদ্দের পরিচয়।', quizPassMark: 70, quizDisplayCount: 5 } });
  await prisma.module.upsert({ where: { id: 'mod-1-3-2' }, update: {}, create: { id: 'mod-1-3-2', subjectId: 'subj-1-3', title: 'গুন্নাহ ও এর প্রয়োগ', order: 1, contentType: 'VIDEO', duration: '৪০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'গুন্নার সংজ্ঞা, প্রকারভেদ ও ব্যবহার।', quizPassMark: 70, quizDisplayCount: 5 } });

  // ─────────────────────────────────────────────
  // 5. Subjects & Modules for Course 2
  // ─────────────────────────────────────────────
  console.log('Creating subjects & modules for Course 2...');

  const subj2_1 = await prisma.subject.upsert({
    where: { id: 'subj-2-1' },
    update: {},
    create: {
      id: 'subj-2-1',
      courseId: 'course-2',
      title: 'তাওহীদ - আল্লাহর একত্ববাদ',
      description: 'তাওহীদের সংজ্ঞা, প্রকারভেদ ও গুরুত্ব',
      order: 0,
      finalExamEnabled: true,
      finalExamPassMark: 60,
      finalExamDisplayCount: 10,
    },
  });

  const subj2_2 = await prisma.subject.upsert({
    where: { id: 'subj-2-2' },
    update: {},
    create: {
      id: 'subj-2-2',
      courseId: 'course-2',
      title: 'রিসালাত - নবুওয়াত ও রাসূলগণ',
      description: 'নবী-রাসূলগণের পরিচয় ও মিশন',
      order: 1,
      finalExamEnabled: true,
      finalExamPassMark: 60,
      finalExamDisplayCount: 10,
    },
  });

  const subj2_3 = await prisma.subject.upsert({
    where: { id: 'subj-2-3' },
    update: {},
    create: {
      id: 'subj-2-3',
      courseId: 'course-2',
      title: 'আখিরাত ও পরকালীন জীবন',
      description: 'মৃত্যু পরবর্তী জীবন, কবর, হাশর, জান্নাত ও জাহান্নাম',
      order: 2,
      finalExamEnabled: true,
      finalExamPassMark: 60,
      finalExamDisplayCount: 10,
    },
  });

  await prisma.module.upsert({ where: { id: 'mod-2-1-1' }, update: {}, create: { id: 'mod-2-1-1', subjectId: 'subj-2-1', title: 'তাওহীদের সংজ্ঞা ও গুরুত্ব', order: 0, contentType: 'VIDEO', duration: '৫০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'তাওহীদ মানে কী এবং কেন এটি ইসলামের মূল।', quizPassMark: 70 } });
  await prisma.module.upsert({ where: { id: 'mod-2-1-2' }, update: {}, create: { id: 'mod-2-1-2', subjectId: 'subj-2-1', title: 'তাওহীদুর রুবুবিয়্যাহ', order: 1, contentType: 'VIDEO', duration: '৪৫ মiনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'আল্লাহর প্রভুত্বের একত্ববাদ।', quizPassMark: 70 } });
  await prisma.module.upsert({ where: { id: 'mod-2-1-3' }, update: {}, create: { id: 'mod-2-1-3', subjectId: 'subj-2-1', title: 'তাওহীদুল উলুহিয়্যাহ', order: 2, contentType: 'VIDEO', duration: '৫৫ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'আল্লাহর ইবাদতের একত্ববাদ।', quizPassMark: 70 } });
  await prisma.module.upsert({ where: { id: 'mod-2-2-1' }, update: {}, create: { id: 'mod-2-2-1', subjectId: 'subj-2-2', title: 'নবুওয়াতের প্রয়োজনীয়তা', order: 0, contentType: 'VIDEO', duration: '৪০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'আল্লাহ কেন নবী-রাসূল পাঠিয়েছেন।', quizPassMark: 70 } });
  await prisma.module.upsert({ where: { id: 'mod-2-2-2' }, update: {}, create: { id: 'mod-2-2-2', subjectId: 'subj-2-2', title: 'মুহাম্মাদ ﷺ এর রিসালাত', order: 1, contentType: 'VIDEO', duration: '৬০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'শেষ নবীর পরিচয় ও মিশন।', quizPassMark: 70 } });
  await prisma.module.upsert({ where: { id: 'mod-2-3-1' }, update: {}, create: { id: 'mod-2-3-1', subjectId: 'subj-2-3', title: 'মৃত্যু ও কবরের জীবন', order: 0, contentType: 'VIDEO', duration: '৫০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'মৃত্যু পরবর্তী অবস্থা ও কবরের প্রশ্ন।', quizPassMark: 70 } });
  await prisma.module.upsert({ where: { id: 'mod-2-3-2' }, update: {}, create: { id: 'mod-2-3-2', subjectId: 'subj-2-3', title: 'জান্নাত ও জাহান্নামের বিবরণ', order: 1, contentType: 'TEXT', duration: '৩৫ মিনিট', body: 'জান্নাতের নিয়ামত ও জাহান্নামের আজাব সম্পর্কে কুরআন ও হাদীসের বিবরণ।', quizPassMark: 70 } });

  // ─────────────────────────────────────────────
  // 6. Subjects & Modules for Course 3 (Paid)
  // ─────────────────────────────────────────────
  console.log('Creating subjects & modules for Course 3...');

  const subj3_1 = await prisma.subject.upsert({
    where: { id: 'subj-3-1' },
    update: {},
    create: {
      id: 'subj-3-1',
      courseId: 'course-3',
      title: 'সালাত - নামাজের বিস্তারিত বিধান',
      description: 'নামাজের ফরয, ওয়াজিব, সুন্নত ও মুস্তাহাব সম্পর্কে',
      order: 0,
      finalExamEnabled: true,
      finalExamPassMark: 70,
      finalExamDisplayCount: 15,
    },
  });

  const subj3_2 = await prisma.subject.upsert({
    where: { id: 'subj-3-2' },
    update: {},
    create: {
      id: 'subj-3-2',
      courseId: 'course-3',
      title: 'সিয়াম - রোজার বিধান ও মাসায়েল',
      description: 'রমজানের ফাজায়েল, রোজার নিয়মকানুন এবং বিশেষ মাসায়েল',
      order: 1,
      finalExamEnabled: true,
      finalExamPassMark: 70,
      finalExamDisplayCount: 15,
    },
  });

  const subj3_3 = await prisma.subject.upsert({
    where: { id: 'subj-3-3' },
    update: {},
    create: {
      id: 'subj-3-3',
      courseId: 'course-3',
      title: 'যাকাত ও সদকা',
      description: 'যাকাতের নিসাব, হিসাব ও বিতরণ পদ্ধতি',
      order: 2,
      finalExamEnabled: true,
      finalExamPassMark: 70,
      finalExamDisplayCount: 15,
    },
  });

  await prisma.module.upsert({ where: { id: 'mod-3-1-1' }, update: {}, create: { id: 'mod-3-1-1', subjectId: 'subj-3-1', title: 'নামাজের ওয়াক্ত ও শর্ত', order: 0, contentType: 'VIDEO', duration: '৫৫ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'পাঁচ ওয়াক্ত নামাজের সময়সীমা ও পূর্বশর্ত।', quizPassMark: 80 } });
  await prisma.module.upsert({ where: { id: 'mod-3-1-2' }, update: {}, create: { id: 'mod-3-1-2', subjectId: 'subj-3-1', title: 'অযু ও তায়াম্মুম', order: 1, contentType: 'VIDEO', duration: '৬০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'সহীহ অযুর পদ্ধতি ও তায়াম্মুমের বিধান।', quizPassMark: 80 } });
  await prisma.module.upsert({ where: { id: 'mod-3-1-3' }, update: {}, create: { id: 'mod-3-1-3', subjectId: 'subj-3-1', title: 'নামাজের ফরয ও ওয়াজিব', order: 2, contentType: 'VIDEO', duration: '৫০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'নামাজের মধ্যে কোনটি ফরয আর কোনটি ওয়াজিব।', quizPassMark: 80 } });
  await prisma.module.upsert({ where: { id: 'mod-3-2-1' }, update: {}, create: { id: 'mod-3-2-1', subjectId: 'subj-3-2', title: 'রোজার ফরয ও শর্তাবলী', order: 0, contentType: 'VIDEO', duration: '৪৫ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'রোজার নিয়ত, সেহেরি ও ইফতারের বিধান।', quizPassMark: 80 } });
  await prisma.module.upsert({ where: { id: 'mod-3-2-2' }, update: {}, create: { id: 'mod-3-2-2', subjectId: 'subj-3-2', title: 'রোজা ভঙ্গের কারণ ও কাযা', order: 1, contentType: 'TEXT', duration: '৩৫ মিনিট', body: 'কোন কারণে রোজা ভাঙে ও কীভাবে কাযা করতে হবে।', quizPassMark: 80 } });
  await prisma.module.upsert({ where: { id: 'mod-3-3-1' }, update: {}, create: { id: 'mod-3-3-1', subjectId: 'subj-3-3', title: 'যাকাতের নিসাব ও হিসাব', order: 0, contentType: 'VIDEO', duration: '৫০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'সোনা, রূপা ও টাকার যাকাতের হিসাব।', quizPassMark: 80 } });
  await prisma.module.upsert({ where: { id: 'mod-3-3-2' }, update: {}, create: { id: 'mod-3-3-2', subjectId: 'subj-3-3', title: 'যাকাতের হকদার কারা', order: 1, contentType: 'VIDEO', duration: '৪০ মিনিট', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', body: 'আট শ্রেণীর যাকাতগ্রহীতার পরিচয়।', quizPassMark: 80 } });

  // ─────────────────────────────────────────────
  // 7. Final Exam Questions for Subject 1
  // ─────────────────────────────────────────────
  console.log('Creating final exam questions...');

  const examQs1 = [
    { question: 'মাখরাজ শব্দের অর্থ কী?', options: ['প্রবেশস্থান', 'উচ্চারণস্থান', 'শ্বাসস্থান', 'বিরামস্থান'], correct: 1, explanation: 'মাখরাজ অর্থ উচ্চারণস্থান — যেখান থেকে হরফ উচ্চারিত হয়।' },
    { question: 'হলকি হরফ কয়টি?', options: ['৪টি', '৫টি', '৬টি', '৭টি'], correct: 2, explanation: 'হলকি হরফ ৬টি: আলিফ, হা, খা, আইন, গাইন, হা।' },
    { question: 'শাফাওয়ী হরফ কোন অঙ্গ থেকে উচ্চারিত হয়?', options: ['গলা', 'জিভ', 'ঠোঁট', 'নাক'], correct: 2, explanation: 'শাফাওয়ী হরফ ঠোঁট (شفة) থেকে উচ্চারিত হয়।' },
    { question: 'তাজবীদ শব্দের অর্থ কী?', options: ['পড়া', 'সুন্দর করা', 'মুখস্থ করা', 'অনুবাদ করা'], correct: 1, explanation: 'তাজবীদ অর্থ সুন্দর করা — কুরআন সুন্দরভাবে পড়ার বিজ্ঞান।' },
    { question: 'লাহায়ী হরফ কোন অঙ্গ থেকে উচ্চারিত হয়?', options: ['গলা', 'জিভ', 'ঠোঁট', 'দাঁত'], correct: 1, explanation: 'লাহায়ী হরফ জিভ (لسان) থেকে উচ্চারিত হয়।' },
    { question: 'কুরআন পড়ার সবচেয়ে সঠিক পদ্ধতি কোনটি?', options: ['দ্রুত পড়া', 'তাজবীদ সহ পড়া', 'চুপে চুপে পড়া', 'উচুঁ স্বরে পড়া'], correct: 1, explanation: 'তাজবীদ সহ পড়াই কুরআন তিলাওয়াতের সঠিক পদ্ধতি।' },
    { question: 'ইদগাম মানে কী?', options: ['বিরতি', 'প্রবেশ করানো/মিশিয়ে পড়া', 'টানা পড়া', 'নাসিকা আওয়াজ'], correct: 1, explanation: 'ইদগাম মানে এক হরফকে পরবর্তী হরফে মিশিয়ে পড়া।' },
    { question: 'গুন্নাহ কোন হরফে সবচেয়ে বেশি প্রযোজ্য?', options: ['ব', 'মীম ও নূন', 'লাম', 'রা'], correct: 1, explanation: 'মীম ও নূন হরফে গুন্নাহ সবচেয়ে বেশি প্রযোজ্য।' },
    { question: 'মাদ্দ কী?', options: ['বিরতি চিহ্ন', 'টানা পড়া', 'নাসিকা স্বর', 'দ্রুত পড়া'], correct: 1, explanation: 'মাদ্দ মানে টানা পড়া — নির্দিষ্ট হরফকে দীর্ঘায়িত করা।' },
    { question: 'সহীহ তিলাওয়াতের জন্য কোনটি আবশ্যক?', options: ['শুধু অর্থ বোঝা', 'শুধু মুখস্থ করা', 'মাখরাজ ও তাজবীদ জানা', 'দ্রুত পড়া শেখা'], correct: 2, explanation: 'সহীহ তিলাওয়াতের জন্য মাখরাজ ও তাজবীদ দুটোই জানা আবশ্যক।' },
  ];

  for (let i = 0; i < examQs1.length; i++) {
    await prisma.subjectFinalExamQuiz.upsert({
      where: { id: `fq-1-1-${i + 1}` },
      update: {},
      create: { id: `fq-1-1-${i + 1}`, subjectId: 'subj-1-1', ...examQs1[i] },
    });
  }

  // Questions for subj-2-1 (Tawheed)
  const examQsTawheed = [
    { question: 'তাওহীদ শব্দের অর্থ কী?', options: ['বিশ্বাস', 'একত্ববাদ', 'আনুগত্য', 'ভক্তি'], correct: 1, explanation: 'তাওহীদ মানে আল্লাহর একত্ব স্বীকার করা।' },
    { question: 'তাওহীদ কত প্রকার?', options: ['দুই', 'তিন', 'চার', 'পাঁচ'], correct: 1, explanation: 'তাওহীদ তিন প্রকার: রুবুবিয়্যাহ, উলুহিয়্যাহ, আসমা ওয়া সিফাত।' },
    { question: 'শিরক কী?', options: ['নামাজ না পড়া', 'আল্লাহর সাথে কাউকে অংশীদার করা', 'মিথ্যা বলা', 'চুরি করা'], correct: 1, explanation: 'শিরক হলো আল্লাহর ইবাদতে অন্য কাউকে শরীক করা।' },
    { question: 'তাওহীদুল উলুহিয়্যাহ মানে কী?', options: ['আল্লাহর প্রভুত্বের একত্ব', 'আল্লাহর ইবাদতের একত্ব', 'আল্লাহর নামের একত্ব', 'আল্লাহর গুণের একত্ব'], correct: 1, explanation: 'তাওহীদুল উলুহিয়্যাহ মানে আল্লাহর ইবাদতের ক্ষেত্রে একত্ব।' },
    { question: 'সবচেয়ে বড় গুনাহ কোনটি?', options: ['হত্যা', 'শিরক', 'চুরি', 'মিথ্যা'], correct: 1, explanation: 'শিরক হলো সবচেয়ে বড় গুনাহ যা আল্লাহ ক্ষমা করেন না।' },
  ];

  for (let i = 0; i < examQsTawheed.length; i++) {
    await prisma.subjectFinalExamQuiz.upsert({
      where: { id: `fq-2-1-${i + 1}` },
      update: {},
      create: { id: `fq-2-1-${i + 1}`, subjectId: 'subj-2-1', ...examQsTawheed[i] },
    });
  }

  // ─────────────────────────────────────────────
  // 8. Students
  // ─────────────────────────────────────────────
  console.log('Creating student accounts...');

  const students = await Promise.all([
    prisma.user.upsert({ where: { email: 'ahmed.hossain@gmail.com' }, update: {}, create: { id: 'stu-1', name: 'আহমেদ হোসেন', email: 'ahmed.hossain@gmail.com', mobile: '01711111111', passwordHash: testPasswordHash, role: 'STUDENT', status: 'ACTIVE', division: 'ঢাকা', district: 'ঢাকা', institution: 'ঢাকা বিশ্ববিদ্যালয়', totalPoints: 450 } }),
    prisma.user.upsert({ where: { email: 'fatema.begum@gmail.com' }, update: {}, create: { id: 'stu-2', name: 'ফাতেমা বেগম', email: 'fatema.begum@gmail.com', mobile: '01722222222', passwordHash: testPasswordHash, role: 'STUDENT', status: 'ACTIVE', division: 'চট্টগ্রাম', district: 'চট্টগ্রাম', institution: 'চট্টগ্রাম বিশ্ববিদ্যালয়', totalPoints: 380 } }),
    prisma.user.upsert({ where: { email: 'rakib.islam@gmail.com' }, update: {}, create: { id: 'stu-3', name: 'রাকিব ইসলাম', email: 'rakib.islam@gmail.com', mobile: '01733333333', passwordHash: testPasswordHash, role: 'STUDENT', status: 'ACTIVE', division: 'রাজশাহী', district: 'রাজশাহী', totalPoints: 290 } }),
    prisma.user.upsert({ where: { email: 'nusrat.jahan@gmail.com' }, update: {}, create: { id: 'stu-4', name: 'নুসরাত জাহান', email: 'nusrat.jahan@gmail.com', mobile: '01744444444', passwordHash: testPasswordHash, role: 'STUDENT', status: 'ACTIVE', division: 'সিলেট', district: 'সিলেট', institution: 'সিলেট কৃষি বিশ্ববিদ্যালয়', totalPoints: 510 } }),
    prisma.user.upsert({ where: { email: 'karim.uddin@gmail.com' }, update: {}, create: { id: 'stu-5', name: 'কারিম উদ্দিন', email: 'karim.uddin@gmail.com', mobile: '01755555555', passwordHash: testPasswordHash, role: 'STUDENT', status: 'ACTIVE', division: 'খুলনা', district: 'খুলনা', totalPoints: 175 } }),
    prisma.user.upsert({ where: { email: 'maryam.sultana@gmail.com' }, update: {}, create: { id: 'stu-6', name: 'মরিয়ম সুলতানা', email: 'maryam.sultana@gmail.com', mobile: '01766666666', passwordHash: testPasswordHash, role: 'STUDENT', status: 'ACTIVE', division: 'বরিশাল', district: 'বরিশাল', totalPoints: 320 } }),
    prisma.user.upsert({ where: { email: 'tariq.hasan@gmail.com' }, update: {}, create: { id: 'stu-7', name: 'তারিক হাসান', email: 'tariq.hasan@gmail.com', mobile: '01777777777', passwordHash: testPasswordHash, role: 'STUDENT', status: 'ACTIVE', division: 'ময়মনসিংহ', district: 'ময়মনসিংহ', totalPoints: 240 } }),
    prisma.user.upsert({ where: { email: 'samira.khatun@gmail.com' }, update: {}, create: { id: 'stu-8', name: 'সামিরা খাতুন', email: 'samira.khatun@gmail.com', mobile: '01788888888', passwordHash: testPasswordHash, role: 'STUDENT', status: 'ACTIVE', division: 'ঢাকা', district: 'নারায়ণগঞ্জ', totalPoints: 195 } }),
  ]);

  // ─────────────────────────────────────────────
  // 9. Batches
  // ─────────────────────────────────────────────
  console.log('Creating batches...');

  const batch1 = await prisma.batch.upsert({
    where: { name: 'তাজবীদ ব্যাচ - ২০২৫ (প্রথম)' },
    update: {},
    create: {
      id: 'batch-1',
      name: 'তাজবীদ ব্যাচ - ২০২৫ (প্রথম)',
      description: 'তাজবীদ ও কুরআন তিলাওয়াতের উপর প্রথম ব্যাচ। ক্লাস শুরু হয়েছে।',
      status: 'ACTIVE',
      coursesLocked: false,
    },
  });

  const batch2 = await prisma.batch.upsert({
    where: { name: 'আকীদা ব্যাচ - ২০২৫' },
    update: {},
    create: {
      id: 'batch-2',
      name: 'আকীদা ব্যাচ - ২০২৫',
      description: 'ইসলামিক আকীদার উপর বিশেষ ব্যাচ। এখন ভর্তি চলছে।',
      status: 'ENROLLING',
      coursesLocked: true,
    },
  });

  const batch3 = await prisma.batch.upsert({
    where: { name: 'ফিকহ ব্যাচ - ২০২৫ (পেইড)' },
    update: {},
    create: {
      id: 'batch-3',
      name: 'ফিকহ ব্যাচ - ২০২৫ (পেইড)',
      description: 'ফিকহুল ইবাদাত প্রিমিয়াম ব্যাচ। সীমিত আসন।',
      status: 'ENROLLING',
      coursesLocked: true,
    },
  });

  // Assign courses to batches
  await prisma.batchCourse.upsert({ where: { batchId_courseId: { batchId: 'batch-1', courseId: 'course-1' } }, update: {}, create: { batchId: 'batch-1', courseId: 'course-1' } });
  await prisma.batchCourse.upsert({ where: { batchId_courseId: { batchId: 'batch-2', courseId: 'course-2' } }, update: {}, create: { batchId: 'batch-2', courseId: 'course-2' } });
  await prisma.batchCourse.upsert({ where: { batchId_courseId: { batchId: 'batch-3', courseId: 'course-3' } }, update: {}, create: { batchId: 'batch-3', courseId: 'course-3' } });

  // Assign students to batch 1
  const batch1Students = ['stu-1', 'stu-2', 'stu-3', 'stu-4'];
  for (const sid of batch1Students) {
    await prisma.batchStudent.upsert({ where: { batchId_userId: { batchId: 'batch-1', userId: sid } }, update: {}, create: { batchId: 'batch-1', userId: sid } });
  }

  // Assign students to batch 2
  const batch2Students = ['stu-5', 'stu-6', 'stu-7'];
  for (const sid of batch2Students) {
    await prisma.batchStudent.upsert({ where: { batchId_userId: { batchId: 'batch-2', userId: sid } }, update: {}, create: { batchId: 'batch-2', userId: sid } });
  }

  // ─────────────────────────────────────────────
  // 10. Enrollments
  // ─────────────────────────────────────────────
  console.log('Creating enrollments...');

  await prisma.enrollment.upsert({ where: { userId_courseId: { userId: 'stu-1', courseId: 'course-1' } }, update: {}, create: { userId: 'stu-1', courseId: 'course-1', status: 'ACTIVE', progress: 75, completedModules: 6 } });
  await prisma.enrollment.upsert({ where: { userId_courseId: { userId: 'stu-2', courseId: 'course-1' } }, update: {}, create: { userId: 'stu-2', courseId: 'course-1', status: 'ACTIVE', progress: 50, completedModules: 4 } });
  await prisma.enrollment.upsert({ where: { userId_courseId: { userId: 'stu-3', courseId: 'course-1' } }, update: {}, create: { userId: 'stu-3', courseId: 'course-1', status: 'ACTIVE', progress: 25, completedModules: 2 } });
  await prisma.enrollment.upsert({ where: { userId_courseId: { userId: 'stu-4', courseId: 'course-1' } }, update: {}, create: { userId: 'stu-4', courseId: 'course-1', status: 'COMPLETED', progress: 100, completedModules: 9, completedAt: new Date('2025-06-15') } });
  await prisma.enrollment.upsert({ where: { userId_courseId: { userId: 'stu-5', courseId: 'course-2' } }, update: {}, create: { userId: 'stu-5', courseId: 'course-2', status: 'ACTIVE', progress: 40, completedModules: 3 } });
  await prisma.enrollment.upsert({ where: { userId_courseId: { userId: 'stu-6', courseId: 'course-2' } }, update: {}, create: { userId: 'stu-6', courseId: 'course-2', status: 'ACTIVE', progress: 60, completedModules: 4 } });
  await prisma.enrollment.upsert({ where: { userId_courseId: { userId: 'stu-7', courseId: 'course-2' } }, update: {}, create: { userId: 'stu-7', courseId: 'course-2', status: 'ACTIVE', progress: 20, completedModules: 1 } });
  await prisma.enrollment.upsert({ where: { userId_courseId: { userId: 'stu-1', courseId: 'course-4' } }, update: {}, create: { userId: 'stu-1', courseId: 'course-4', status: 'ACTIVE', progress: 30, completedModules: 1 } });

  // ─────────────────────────────────────────────
  // 11. Final Exam Sessions (some students completed exams)
  // ─────────────────────────────────────────────
  console.log('Creating exam sessions...');

  await prisma.subjectFinalExamSession.upsert({
    where: { userId_subjectId: { userId: 'stu-1', subjectId: 'subj-1-1' } },
    update: {},
    create: { userId: 'stu-1', subjectId: 'subj-1-1', score: 8, total: 10, passed: true, answers: { '0': 1, '1': 2, '2': 2, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 2 } },
  });

  await prisma.subjectFinalExamSession.upsert({
    where: { userId_subjectId: { userId: 'stu-4', subjectId: 'subj-1-1' } },
    update: {},
    create: { userId: 'stu-4', subjectId: 'subj-1-1', score: 9, total: 10, passed: true, answers: { '0': 1, '1': 2, '2': 2, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 2 } },
  });

  await prisma.subjectFinalExamSession.upsert({
    where: { userId_subjectId: { userId: 'stu-2', subjectId: 'subj-1-1' } },
    update: {},
    create: { userId: 'stu-2', subjectId: 'subj-1-1', score: 6, total: 10, passed: true, answers: { '0': 1, '1': 2, '2': 2, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 2 } },
  });

  await prisma.subjectFinalExamSession.upsert({
    where: { userId_subjectId: { userId: 'stu-5', subjectId: 'subj-2-1' } },
    update: {},
    create: { userId: 'stu-5', subjectId: 'subj-2-1', score: 4, total: 5, passed: true, answers: { '0': 1, '1': 1, '2': 1, '3': 1, '4': 1 } },
  });

  // ─────────────────────────────────────────────
  // 12. Viva Scores
  // ─────────────────────────────────────────────
  console.log('Creating viva scores...');

  await prisma.vivaScore.upsert({ where: { userId_courseId: { userId: 'stu-4', courseId: 'course-1' } }, update: {}, create: { userId: 'stu-4', courseId: 'course-1', marks: 18, remarks: 'অসাধারণ তিলাওয়াত। উচ্চারণ সহীহ।', gradedBy: 'admin@iqcacademy.com' } });
  await prisma.vivaScore.upsert({ where: { userId_courseId: { userId: 'stu-1', courseId: 'course-1' } }, update: {}, create: { userId: 'stu-1', courseId: 'course-1', marks: 15, remarks: 'ভালো। কিছুটা উন্নতি দরকার।', gradedBy: 'admin@iqcacademy.com' } });
  await prisma.vivaScore.upsert({ where: { userId_courseId: { userId: 'stu-2', courseId: 'course-1' } }, update: {}, create: { userId: 'stu-2', courseId: 'course-1', marks: 12, remarks: 'গড়পড়তা। আরও চর্চা করতে হবে।', gradedBy: 'admin@iqcacademy.com' } });

  // ─────────────────────────────────────────────
  // 13. Projects (Charity)
  // ─────────────────────────────────────────────
  console.log('Creating charity projects...');

  await prisma.project.upsert({ where: { id: 'proj-1' }, update: {}, create: { id: 'proj-1', title: 'মসজিদ নির্মাণ প্রকল্প', description: 'চট্টগ্রামের প্রত্যন্ত অঞ্চলে একটি মসজিদ নির্মাণের জন্য সাহায্য করুন। এই মসজিদটি এলাকার ৫০০+ মুসল্লির নামাজের স্থান হবে।', targetAmount: 500000, raisedAmount: 287500, icon: '🕌', category: 'মসজিদ', location: 'চট্টগ্রাম, বাংলাদেশ', status: 'ACTIVE', donorCount: 142, deadline: new Date('2026-12-31') } });
  await prisma.project.upsert({ where: { id: 'proj-2' }, update: {}, create: { id: 'proj-2', title: 'এতিমখানা সহায়তা', description: 'ঢাকার একটি এতিমখানার ৮০ জন শিশুর শিক্ষা, খাবার ও চিকিৎসার ব্যয় বহনে সাহায্য করুন।', targetAmount: 300000, raisedAmount: 185000, icon: '🏠', category: 'এতিম সেবা', location: 'ঢাকা, বাংলাদেশ', status: 'ACTIVE', donorCount: 98, deadline: new Date('2026-06-30') } });
  await prisma.project.upsert({ where: { id: 'proj-3' }, update: {}, create: { id: 'proj-3', title: 'কুরআন বিতরণ প্রকল্প', description: 'দেশের বিভিন্ন প্রত্যন্ত অঞ্চলে বিনামূল্যে কুরআনুল কারীম বিতরণ করুন। প্রতিটি কুরআনের মূল্য মাত্র ৫০ টাকা।', targetAmount: 100000, raisedAmount: 72000, icon: '📖', category: 'দাওয়াহ', location: 'সারা বাংলাদেশ', status: 'ACTIVE', donorCount: 310 } });
  await prisma.project.upsert({ where: { id: 'proj-4' }, update: {}, create: { id: 'proj-4', title: 'বিশুদ্ধ পানির কূপ খনন', description: 'উত্তরবঙ্গের আর্সেনিকমুক্ত বিশুদ্ধ পানির ব্যবস্থা করতে ৫টি নলকূপ স্থাপনে সাহায্য করুন।', targetAmount: 150000, raisedAmount: 150000, icon: '💧', category: 'পানি', location: 'রাজশাহী, বাংলাদেশ', status: 'COMPLETED', donorCount: 87 } });

  // ─────────────────────────────────────────────
  // 14. Notices
  // ─────────────────────────────────────────────
  console.log('Creating notices...');

  await prisma.notice.upsert({ where: { id: 'notice-1' }, update: {}, create: { id: 'notice-1', title: '🎉 নতুন ব্যাচ শুরু হচ্ছে - আকীদা কোর্স ২০২৫', body: 'আলহামদুলিল্লাহ! আকীদা ও বিশ্বাস কোর্সের নতুন ব্যাচে ভর্তি শুরু হয়েছে। আসন সীমিত। এখনই নাম নথিভুক্ত করুন।', link: '/batches', linkText: 'ব্যাচ দেখুন', important: true, order: 10, publishedAt: new Date() } });
  await prisma.notice.upsert({ where: { id: 'notice-2' }, update: {}, create: { id: 'notice-2', title: '📅 লাইভ ক্লাসের সময়সূচি', body: 'প্রতি শুক্রবার ও শনিবার রাত ৯টায় লাইভ ক্লাস অনুষ্ঠিত হবে। Google Meet লিংক ক্লাসের ১ ঘণ্টা আগে হোয়াটসঅ্যাপ গ্রুপে দেওয়া হবে।', important: false, order: 9, publishedAt: new Date() } });
  await prisma.notice.upsert({ where: { id: 'notice-3' }, update: {}, create: { id: 'notice-3', title: '📝 ফাইনাল পরীক্ষার ফলাফল প্রকাশিত', body: 'তাজবীদ ব্যাচ ২০২৫-এর প্রথম বিষয়ের ফাইনাল পরীক্ষার ফলাফল প্রকাশিত হয়েছে। লিডারবোর্ড চেক করুন।', link: '/courses/course-1/leaderboard', linkText: 'ফলাফল দেখুন', important: false, order: 8, publishedAt: new Date() } });
  await prisma.notice.upsert({ where: { id: 'notice-4' }, update: {}, create: { id: 'notice-4', title: '💳 পেইড কোর্সে বিশেষ ছাড়', body: 'রমজান উপলক্ষে ফিকহুল ইবাদাত প্রিমিয়াম কোর্সে ৩৩% বিশেষ ছাড় পাচ্ছেন। মূল্য ১৮০০ টাকার পরিবর্তে মাত্র ১২০০ টাকা।', important: true, order: 7, publishedAt: new Date() } });
  await prisma.notice.upsert({ where: { id: 'notice-5' }, update: {}, create: { id: 'notice-5', title: '🤲 কুরআন বিতরণ প্রজেক্টে অংশ নিন', body: 'আল্লাহর রাস্তায় একটি কুরআন দান করুন। সদকায়ে জারিয়ার এই সুযোগ হাতছাড়া করবেন না।', link: '/projects', linkText: 'দান করুন', important: false, order: 6, publishedAt: new Date() } });

  // ─────────────────────────────────────────────
  // 15. Content Articles
  // ─────────────────────────────────────────────
  console.log('Creating content articles...');

  await prisma.content.upsert({ where: { id: 'content-1' }, update: {}, create: { id: 'content-1', title: 'তাজবীদ শিক্ষার গুরুত্ব ও পদ্ধতি', type: 'ARTICLE', body: '## তাজবীদ কী?\n\nতাজবীদ (تجويد) শব্দের অর্থ সুন্দর করা বা উৎকৃষ্ট করা। কুরআন তিলাওয়াতের ক্ষেত্রে তাজবীদ মানে হলো প্রতিটি হরফকে তার নির্দিষ্ট মাখরাজ থেকে সঠিকভাবে উচ্চারণ করা এবং তার গুণাগুণ সহকারে পড়া।\n\n## কেন তাজবীদ শেখা জরুরি?\n\nআল্লাহ তায়ালা ইরশাদ করেন: "এবং কুরআন তিলাওয়াত করো ধীরে ধীরে ও সুস্পষ্টভাবে।" (সূরা মুযযাম্মিল: ৪)\n\nতাজবীদ জানা ছাড়া কুরআন সহীহভাবে পড়া সম্ভব নয়।', tags: ['তাজবীদ', 'কুরআন', 'শিক্ষা'], readingTime: '৮ মিনিট', published: true } });
  await prisma.content.upsert({ where: { id: 'content-2' }, update: {}, create: { id: 'content-2', title: 'নামাজে মনোযোগ ধরে রাখার ১০টি উপায়', type: 'ARTICLE', body: '## নামাজে একাগ্রতা (খুশু)\n\nখুশু মানে হলো নামাজে মন ও শরীরের পূর্ণ উপস্থিতি। এটি সালাতের আত্মা।\n\n## ১০টি পরীক্ষিত উপায়\n\n১. নামাজের আগে ওযু ভালোভাবে করুন\n২. সুতরা ব্যবহার করুন\n৩. আয়াতের অর্থ বোঝার চেষ্টা করুন\n৪. ধীরে ধীরে পড়ুন\n৫. সিজদায় বেশি দোয়া করুন', tags: ['নামাজ', 'আমল', 'আধ্যাত্মিকতা'], readingTime: '৬ মিনিট', published: true } });
  await prisma.content.upsert({ where: { id: 'content-3' }, update: {}, create: { id: 'content-3', title: 'রমজানের ফজিলত ও আমল', type: 'ARTICLE', body: '## রমজান - রহমতের মাস\n\nরাসূলুল্লাহ ﷺ বলেছেন: "রমজান মাস এসেছে, এটি বরকতময় মাস। আল্লাহ তায়ালা তোমাদের উপর রোজা ফরয করেছেন।"\n\n## রমজানের বিশেষ আমল\n\n- তারাবীহ নামাজ\n- কুরআন তিলাওয়াত\n- ইতিকাফ\n- লাইলাতুল কদরের অনুসন্ধান\n- বেশি বেশি দান-সদকা', tags: ['রমজান', 'রোজা', 'আমল'], readingTime: '৫ মিনিট', published: true } });
  await prisma.content.upsert({ where: { id: 'content-4' }, update: {}, create: { id: 'content-4', title: 'শিরক থেকে বাঁচার উপায়', type: 'ARTICLE', body: '## শিরক - সবচেয়ে বড় পাপ\n\nআল্লাহ বলেন: "নিশ্চয় আল্লাহ তাঁর সাথে শরিক করাকে ক্ষমা করেন না।" (সূরা নিসা: ৪৮)\n\n## প্রকারভেদ\n\n১. শিরকে আকবর (বড় শিরক)\n২. শিরকে আসগার (ছোট শিরক)\n\n## রক্ষা পাওয়ার উপায়\n\n- তাওহীদের ইলম অর্জন করুন\n- নিয়মিত আয়াতুল কুরসি পড়ুন\n- সূরা ইখলাস তিনবার পড়লে কুরআনের এক তৃতীয়াংশ সওয়াব হয়', tags: ['আকীদা', 'তাওহীদ', 'শিরক'], readingTime: '৭ মিনিট', published: true } });

  // ─────────────────────────────────────────────
  // 16. Gallery
  // ─────────────────────────────────────────────
  console.log('Creating gallery items...');

  const galleryItems = [
    { id: 'gallery-1', title: 'তাজবীদ ক্লাসের লাইভ সেশন', type: 'class', imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800', date: new Date('2025-03-15') },
    { id: 'gallery-2', title: 'মসজিদ নির্মাণ প্রকল্পের অগ্রগতি', type: 'project', imageUrl: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800', date: new Date('2025-04-20') },
    { id: 'gallery-3', title: 'ইফতার মাহফিল ২০২৫', type: 'event', imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800', date: new Date('2025-03-30') },
    { id: 'gallery-4', title: 'এতিমখানায় কুরআন বিতরণ', type: 'project', imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800', date: new Date('2025-05-10') },
    { id: 'gallery-5', title: 'অনলাইন গ্র্যাজুয়েশন অনুষ্ঠান', type: 'event', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', date: new Date('2025-06-01') },
    { id: 'gallery-6', title: 'সাপ্তাহিক কুরআন প্রতিযোগিতা', type: 'event', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800', date: new Date('2025-06-14') },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.upsert({ where: { id: item.id }, update: {}, create: item });
  }

  // ─────────────────────────────────────────────
  // 17. Donations
  // ─────────────────────────────────────────────
  console.log('Creating donations...');

  await prisma.donation.upsert({ where: { txId: 'BK240501001' }, update: {}, create: { id: 'don-1', userId: 'stu-1', projectId: 'proj-1', name: 'আহমেদ হোসেন', mobile: '01711111111', amount: 5000, txId: 'BK240501001', method: 'BKASH', status: 'VERIFIED', verifiedAt: new Date('2025-05-02') } });
  await prisma.donation.upsert({ where: { txId: 'NG240502002' }, update: {}, create: { id: 'don-2', userId: 'stu-4', projectId: 'proj-2', name: 'নুসরাত জাহান', mobile: '01744444444', amount: 2500, txId: 'NG240502002', method: 'NAGAD', status: 'VERIFIED', verifiedAt: new Date('2025-05-03') } });
  await prisma.donation.upsert({ where: { txId: 'BK240503003' }, update: {}, create: { id: 'don-3', projectId: 'proj-3', name: 'আবু সাঈদ', mobile: '01799999999', amount: 1000, txId: 'BK240503003', method: 'BKASH', status: 'VERIFIED', verifiedAt: new Date('2025-05-05') } });
  await prisma.donation.upsert({ where: { txId: 'BK240510004' }, update: {}, create: { id: 'don-4', projectId: 'proj-1', name: 'সাইফুল ইসলাম', mobile: '01788888880', amount: 3000, txId: 'BK240510004', method: 'BKASH', status: 'PENDING' } });

  // ─────────────────────────────────────────────
  // Done!
  // ─────────────────────────────────────────────
  console.log('\n✅ Seeding complete! Here is a summary:');
  console.log('   👤 Admin:    admin@iqcacademy.com / Admin@12345');
  console.log('   🎓 Students: ahmed.hossain@gmail.com / Student@12345 (and 7 more)');
  console.log('   📚 Courses:  4 courses (2 FREE, 1 PAID, 1 FREE Advanced)');
  console.log('   📖 Subjects: 10 subjects across all courses');
  console.log('   🗂️  Modules:  20+ modules');
  console.log('   🏫 Batches:  3 batches (1 ACTIVE, 2 ENROLLING)');
  console.log('   🌍 Projects: 4 charity projects');
  console.log('   📢 Notices:  5 notices');
  console.log('   🖼️  Gallery:  6 gallery items');
  console.log('   📰 Content:  4 articles');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
