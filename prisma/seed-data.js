/**
 * SEED SCRIPT FOR PLACEHOLDER DATA
 * Run: node prisma/seed-data.js
 */
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1. Create Students
  console.log('Creating students...');
  const passwordHash = await argon2.hash('password123');
  
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      name: 'Abdur Rahman',
      email: 'student1@example.com',
      mobile: '01711111111',
      passwordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
    }
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      name: 'Fatima Zahra',
      email: 'student2@example.com',
      mobile: '01722222222',
      passwordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
    }
  });

  // 2. Create Instructor
  console.log('Creating instructor...');
  const instructor = await prisma.instructor.create({
    data: {
      name: 'শাইখ আব্দুল্লাহ আল আমীন',
      title: 'Principal Instructor',
    }
  });

  // 3. Create Courses
  console.log('Creating courses...');
  const course1 = await prisma.course.create({
    data: {
      title: 'কুরআন শিক্ষা (তাজবীদ সহ)',
      description: 'সহজ পদ্ধতিতে সহীহভাবে কুরআন তেলাওয়াত শিখুন।',
      instructorId: instructor.id,
      type: 'FREE',
      price: 0,
      duration: '৩ মাস',
      level: 'Beginner',
      status: 'PUBLISHED',
      enrolledCount: 15,
      modules: {
        create: [
          { title: 'আরবি হরফ পরিচিতি', order: 1, duration: '২ সপ্তাহ' },
          { title: 'মাখরাজ ও সিফাত', order: 2, duration: '৩ সপ্তাহ' },
        ]
      }
    }
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'ইসলামিক ফিন্যান্স মাস্টারক্লাস',
      description: 'হালাল উপার্জন এবং ইসলামিক অর্থনীতির মূলনীতি।',
      instructorId: instructor.id,
      type: 'PAID',
      price: 1500,
      originalPrice: 2000,
      duration: '১ মাস',
      level: 'Intermediate',
      status: 'PUBLISHED',
      enrolledCount: 5,
      modules: {
        create: [
          { title: 'ইসলামিক ফিন্যান্সের ভিত্তি', order: 1, duration: '১ সপ্তাহ' },
          { title: 'সুদ ও তার আধুনিক রূপ', order: 2, duration: '২ সপ্তাহ' },
        ]
      }
    }
  });

  // 4. Create Enrollments
  console.log('Enrolling students...');
  await prisma.enrollment.create({
    data: { userId: student1.id, courseId: course1.id, status: 'ACTIVE' }
  });
  await prisma.enrollment.create({
    data: { userId: student2.id, courseId: course2.id, status: 'ACTIVE' }
  });

  // 5. Create Projects
  console.log('Creating projects...');
  const project1 = await prisma.project.create({
    data: {
      title: 'সিলেটে এতিমখানা নির্মাণ',
      description: '১০০ জন এতিম বাচ্চার জন্য নতুন ভবন নির্মাণ।',
      targetAmount: 500000,
      raisedAmount: 120000,
      category: 'এতিমখানা',
      location: 'সিলেট',
      icon: '🏠',
      status: 'ACTIVE',
    }
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'কুড়িগ্রামে টিউবওয়েল স্থাপন',
      description: 'বিশুদ্ধ পানির অভাবে থাকা মানুষের জন্য ২০টি টিউবওয়েল।',
      targetAmount: 100000,
      raisedAmount: 95000,
      category: 'পানি সরবরাহ',
      location: 'কুড়িগ্রাম',
      icon: '🚰',
      status: 'ACTIVE',
    }
  });

  // 6. Create Donations
  console.log('Creating donations...');
  await prisma.donation.create({
    data: {
      userId: student1.id,
      mobile: student1.mobile,
      amount: 1500,
      method: 'BKASH',
      txId: 'BK12345678',
      status: 'VERIFIED',
    }
  });
  
  await prisma.donation.create({
    data: {
      userId: student2.id,
      mobile: student2.mobile,
      projectId: project1.id,
      amount: 5000,
      method: 'NAGAD',
      txId: 'NG87654321',
      status: 'PENDING',
    }
  });

  await prisma.donation.create({
    data: {
      mobile: '01888888888',
      amount: 1000,
      method: 'ROCKET',
      txId: 'RK99999999',
      status: 'PENDING',
    }
  });

  // 7. Create Notices
  console.log('Creating notices...');
  await prisma.notice.create({
    data: {
      title: 'রমজান উপলক্ষে বিশেষ ছাড়!',
      body: 'সকল পেইড কোর্সে ৫০% ছাড়। কুপন কোড: RAMADAN50',
      important: true,
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    }
  });

  await prisma.notice.create({
    data: {
      title: 'নতুন কোর্স চালু হয়েছে',
      body: 'আগামী শুক্রবার থেকে "হাদিস পরিচিতি" কোর্সের ক্লাস শুরু।',
      important: false,
    }
  });

  console.log('\n✅ Database seeded successfully with placeholder data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
