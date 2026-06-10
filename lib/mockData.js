// Mock data for IQC Academy frontend

export const mockUser = {
  id: 'USR-2025-001',
  name: 'আব্দুর রহমান',
  email: 'rahman@example.com',
  mobile: '01712345678',
  whatsapp: '01712345678',
  facebook: 'https://facebook.com/rahman',
  institution: 'ঢাকা বিশ্ববিদ্যালয়',
  division: 'ঢাকা',
  district: 'ঢাকা',
  upazila: 'সাভার',
  dob: '2000-05-15',
  sscYear: '2018',
  sscBoard: 'ঢাকা',
  sscGpa: '5.00',
  avatar: null,
  joinedDate: '2025-01-15',
  status: 'active',
  coursesCompleted: 3,
  coursesEnrolled: 5,
  totalCourses: 12,
  overallProgress: 58,
  currentStreak: 7,
  totalPoints: 1240,
};

export const mockNotices = [
  {
    id: 1,
    title: 'রমজান বিশেষ কোর্স শুরু হচ্ছে!',
    body: 'আগামী সপ্তাহ থেকে রমজান মাসের বিশেষ কোর্স শুরু হবে। সকলকে রেজিস্ট্রেশন করার অনুরোধ করা হচ্ছে।',
    date: '২০২৫-০১-১০',
    link: '/courses',
    linkText: 'কোর্স দেখুন',
    important: true,
  },
  {
    id: 2,
    title: 'নতুন কন্টেন্ট আপলোড হয়েছে',
    body: 'তাফসিরুল কুরআন সিরিজের নতুন পর্ব আপলোড হয়েছে। পড়ুন এবং কুইজ দিন।',
    date: '২০২৫-০১-০৮',
    link: '/content',
    linkText: 'পড়ুন',
    important: false,
  },
  {
    id: 3,
    title: 'সাপ্তাহিক অনলাইন ক্লাস',
    body: 'প্রতি শুক্রবার রাত ৯টায় অনলাইন ক্লাস অনুষ্ঠিত হবে। Zoom লিংকের জন্য যোগাযোগ করুন।',
    date: '২০২৫-০১-০৬',
    link: null,
    linkText: null,
    important: false,
  },
];

export const mockBannerSlides = [
  {
    id: 1,
    title: 'ইলম অর্জন করুন, জান্নাতের পথ খুঁজুন',
    subtitle: 'IQC Academy-তে স্বাগতম',
    bgColor: 'linear-gradient(135deg, hsl(145,63%,22%) 0%, hsl(145,50%,30%) 100%)',
    icon: '📖',
  },
  {
    id: 2,
    title: 'প্রতিদিন একটু একটু শিখুন',
    subtitle: 'কোর্স, কুইজ এবং আরও অনেক কিছু',
    bgColor: 'linear-gradient(135deg, hsl(38,80%,40%) 0%, hsl(38,70%,50%) 100%)',
    icon: '🌙',
  },
  {
    id: 3,
    title: 'অনলাইন মাদ্রাসায় ভর্তি হন',
    subtitle: 'আলেমদের তত্ত্বাবধানে কুরআন ও হাদিস শিখুন',
    bgColor: 'linear-gradient(135deg, hsl(210,60%,30%) 0%, hsl(145,45%,25%) 100%)',
    icon: '🕌',
  },
];

export const mockSectionNav = [
  { id: 'content',  label: 'কন্টেন্ট সমূহ',      icon: '📚', href: '/content',  color: 'hsl(145,63%,22%)' },
  { id: 'courses',  label: 'কোর্স',             icon: '🎓', href: '/courses',  color: 'hsl(38,80%,48%)'  },
  { id: 'madrasa',  label: 'অনলাইন মাদ্রাসা',    icon: '🕌', href: '/madrasa',  color: 'hsl(210,60%,40%)' },
  { id: 'paid',     label: 'পেইড কোর্স',         icon: '💎', href: '/courses?type=paid', color: 'hsl(280,50%,40%)' },
  { id: 'projects', label: 'আমাদের প্রজেক্ট',    icon: '🌟', href: '/projects', color: 'hsl(15,70%,45%)'  },
  { id: 'gallery',  label: 'গ্যালারি',            icon: '🖼️', href: '/gallery',  color: 'hsl(175,50%,35%)' },
  { id: 'donate',   label: 'ডোনেট করুন',         icon: '💝', href: '/donate',   color: 'hsl(350,60%,45%)' },
  { id: 'profile',  label: 'আমার প্রোফাইল',      icon: '👤', href: '/profile',  color: 'hsl(220,50%,40%)' },
];

export const mockContents = [
  {
    id: 1,
    title: 'তাফসিরুল কুরআন — সূরা আল-ফাতিহা',
    type: 'text',
    description: 'সূরা আল-ফাতিহার বিস্তারিত তাফসির, অর্থ ও প্রাসঙ্গিক হাদিস সহ।',
    cover: null,
    body: `বিসমিল্লাহির রাহমানির রাহিম\n\nসূরা আল-ফাতিহা কুরআনের প্রথম সূরা। এটি উম্মুল কিতাব (কিতাবের মা) নামেও পরিচিত।\n\nআরবি: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nবাংলা: সমস্ত প্রশংসা আল্লাহর, যিনি সমগ্র বিশ্বের প্রতিপালক।\n\nএই সূরা আমাদের শেখায় কিভাবে আল্লাহর কাছে প্রার্থনা করতে হয়।`,
    quizCount: 10,
    quizAttempts: 0,
    maxAttempts: 3,
    isCompleted: false,
    readingTime: '৫ মিনিট',
    publishedDate: '২০২৫-০১-০১',
    tags: ['তাফসির', 'কুরআন', 'সূরা ফাতিহা'],
  },
  {
    id: 2,
    title: 'নামাজের গুরুত্ব ও ফজিলত',
    type: 'video',
    description: 'ইসলামে নামাজের গুরুত্ব নিয়ে বিস্তারিত আলোচনা, দলিলসহ।',
    cover: null,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quizCount: 8,
    quizAttempts: 1,
    maxAttempts: 3,
    isCompleted: false,
    readingTime: '১৫ মিনিট',
    publishedDate: '২০২৫-০১-০৩',
    tags: ['নামাজ', 'ফজিলত', 'ইবাদত'],
  },
  {
    id: 3,
    title: 'আকিদা মূলনীতি — পিডিএফ গাইড',
    type: 'pdf',
    description: 'ইসলামি আকিদার মূল বিষয়সমূহ নিয়ে একটি সম্পূর্ণ গাইড।',
    cover: null,
    pdfUrl: '/sample.pdf',
    quizCount: 15,
    quizAttempts: 3,
    maxAttempts: 3,
    isCompleted: true,
    readingTime: '৩০ মিনিট',
    publishedDate: '২০২৪-১২-২০',
    tags: ['আকিদা', 'তাওহীদ', 'ইমান'],
  },
  {
    id: 4,
    title: 'হাদিস শাস্ত্রের পরিচয়',
    type: 'text',
    description: 'হাদিস কি? কিভাবে হাদিস সংকলিত হয়েছে? হাদিসের প্রকারভেদ।',
    cover: null,
    body: 'হাদিস হলো রাসুলুল্লাহ (সা.)-এর বাণী, কাজ ও অনুমোদনের সংকলন।',
    quizCount: 12,
    quizAttempts: 0,
    maxAttempts: 3,
    isCompleted: false,
    readingTime: '১০ মিনিট',
    publishedDate: '২০২৫-০১-০৫',
    tags: ['হাদিস', 'ইসলামি জ্ঞান'],
  },
];

export const mockQuizQuestions = [
  {
    id: 1,
    question: 'সূরা আল-ফাতিহায় মোট কতটি আয়াত আছে?',
    options: ['৫টি', '৬টি', '৭টি', '৮টি'],
    correct: 2,
    explanation: 'সূরা আল-ফাতিহায় ৭টি আয়াত রয়েছে।',
  },
  {
    id: 2,
    question: '"উম্মুল কিতাব" কোন সূরাকে বলা হয়?',
    options: ['সূরা বাকারা', 'সূরা ফাতিহা', 'সূরা ইখলাস', 'সূরা কাওসার'],
    correct: 1,
    explanation: 'সূরা ফাতিহাকে উম্মুল কিতাব (কিতাবের মা) বলা হয়।',
  },
  {
    id: 3,
    question: 'প্রতিদিন ফরজ নামাজে সূরা ফাতিহা কতবার পড়া হয়?',
    options: ['৫ বার', '১৭ বার', '১৩ বার', '১০ বার'],
    correct: 1,
    explanation: '৫ ওয়াক্তে মোট ১৭ রাকাতে সূরা ফাতিহা পড়া হয়।',
  },
  {
    id: 4,
    question: '"রব্বুল আলামিন" মানে কী?',
    options: ['দয়াময়', 'বিশ্বের প্রতিপালক', 'পরম করুণাময়', 'বিচার দিনের মালিক'],
    correct: 1,
    explanation: 'রব্বুল আলামিন মানে — সমগ্র বিশ্বের প্রতিপালক।',
  },
  {
    id: 5,
    question: '"ইয়্যাকা না\'বুদু" আয়াতের অর্থ কী?',
    options: [
      'আমরা তোমার কাছে সাহায্য চাই',
      'আমরা কেবল তোমারই ইবাদত করি',
      'আমাদের সরল পথ দেখাও',
      'তুমিই একমাত্র উপাস্য',
    ],
    correct: 1,
    explanation: '"ইয়্যাকা না\'বুদু" মানে — আমরা কেবল তোমারই ইবাদত করি।',
  },
];

export const mockCourses = [
  {
    id: 1,
    title: 'কুরআন তিলাওয়াত — বেসিক কোর্স',
    description: 'একদম শুরু থেকে সঠিকভাবে কুরআন তিলাওয়াত শিখুন।',
    type: 'free',
    status: 'enrolled',
    progress: 60,
    completedModules: 3,
    totalModules: 5,
    cover: null,
    instructor: 'মাওলানা আব্দুল করিম',
    duration: '৪ সপ্তাহ',
    level: 'বেসিক',
    modules: [
      { id: 1, title: 'মাখরাজ ও সিফাত পরিচয়', isCompleted: true,  isLocked: false, quizPassed: true  },
      { id: 2, title: 'হরফ চেনা ও উচ্চারণ',      isCompleted: true,  isLocked: false, quizPassed: true  },
      { id: 3, title: 'হরকত ও মদ',               isCompleted: true,  isLocked: false, quizPassed: true  },
      { id: 4, title: 'তাজবিদের মূলনীতি',          isCompleted: false, isLocked: false, quizPassed: false },
      { id: 5, title: 'প্র্যাকটিস সেশন',             isCompleted: false, isLocked: true,  quizPassed: false },
    ],
  },
  {
    id: 2,
    title: 'ইসলামের পাঁচ স্তম্ভ',
    description: 'ইসলামের মূল পাঁচটি বিষয় গভীরভাবে বোঝার সম্পূর্ণ কোর্স।',
    type: 'free',
    status: 'completed',
    progress: 100,
    completedModules: 5,
    totalModules: 5,
    cover: null,
    instructor: 'মুফতি ইউসুফ আলী',
    duration: '৩ সপ্তাহ',
    level: 'মাঝারি',
    modules: [],
  },
  {
    id: 3,
    title: 'সীরাতুন নবী (সা.)',
    description: 'প্রিয় নবী (সা.)-এর জীবনী, ঘটনাসমূহ ও শিক্ষা।',
    type: 'free',
    status: 'not_enrolled',
    progress: 0,
    completedModules: 0,
    totalModules: 8,
    cover: null,
    instructor: 'ড. খালিদ হাসান',
    duration: '৬ সপ্তাহ',
    level: 'উন্নত',
    modules: [],
  },
  {
    id: 4,
    title: 'আরবি ভাষা প্রবেশিকা — প্রিমিয়াম',
    description: 'আরবি ভাষার বেসিক ব্যাকরণ ও কুরআনিক আরবি বোঝার কোর্স।',
    type: 'paid',
    price: 500,
    status: 'locked',
    progress: 0,
    completedModules: 0,
    totalModules: 10,
    cover: null,
    instructor: 'আলেম আশরাফুল ইসলাম',
    duration: '৮ সপ্তাহ',
    level: 'বেসিক',
    modules: [],
  },
];

export const mockMadrasaPrograms = [
  {
    id: 1,
    title: 'প্রাথমিক দরস — নূরানী কায়দা',
    level: 'প্রাথমিক',
    duration: '৩ মাস',
    status: 'enrolled',
    progress: 45,
    modules: 6,
    completedModules: 2,
  },
  {
    id: 2,
    title: 'মাধ্যমিক দরস — কুরআনুল কারিম',
    level: 'মাধ্যমিক',
    duration: '৬ মাস',
    status: 'locked',
    progress: 0,
    modules: 12,
    completedModules: 0,
  },
];

export const mockAchievements = [
  { id: 1, title: 'প্রথম কোর্স সম্পন্ন',      icon: '🎓', unlocked: true  },
  { id: 2, title: '৭ দিনের ধারাবাহিকতা',       icon: '🔥', unlocked: true  },
  { id: 3, title: 'কুরআন পাঠক',               icon: '📖', unlocked: true  },
  { id: 4, title: '৫টি কোর্স সম্পন্ন',          icon: '⭐', unlocked: false },
  { id: 5, title: 'কুইজ চ্যাম্পিয়ন',           icon: '🏆', unlocked: false },
  { id: 6, title: 'দান-সদকাকারী',              icon: '💝', unlocked: false },
];

export const mockGallery = [
  { id: 1, title: 'বার্ষিক সম্মেলন ২০২৪', date: '২০২৪-১২-১৫', type: 'event' },
  { id: 2, title: 'কুরআন প্রতিযোগিতা',     date: '২০২৪-১১-০৫', type: 'event' },
  { id: 3, title: 'অনলাইন ক্লাস সেশন',     date: '২০২৪-১০-২০', type: 'class' },
  { id: 4, title: 'ইফতার মাহফিল',         date: '২০২৪-০৩-২৫', type: 'event' },
];

export const mockProjects = [
  {
    id: 1,
    title: 'মসজিদ নির্মাণ প্রকল্প',
    description: 'সুবিধাবঞ্চিত এলাকায় মসজিদ নির্মাণে সহায়তা।',
    progress: 75,
    target: 500000,
    raised: 375000,
    icon: '🕌',
  },
  {
    id: 2,
    title: 'এতিম শিক্ষা বৃত্তি',
    description: 'এতিম শিশুদের শিক্ষার জন্য বৃত্তি প্রদান।',
    progress: 40,
    target: 200000,
    raised: 80000,
    icon: '📚',
  },
];

// Admin mock data
export const mockAdminStats = {
  totalUsers: 1247,
  pendingApprovals: 23,
  newDonations: 8,
  totalContent: 45,
  totalCourses: 12,
  totalDonations: 385000,
};

export const mockPendingUsers = [
  { id: 'REG-001', name: 'মোহাম্মদ আলী', email: 'ali@example.com', mobile: '01811111111', institution: 'ঢাকা কলেজ', submittedAt: '২০২৫-০১-১০', status: 'pending' },
  { id: 'REG-002', name: 'ফাতিমা বেগম', email: 'fatima@example.com', mobile: '01922222222', institution: 'ইডেন কলেজ', submittedAt: '২০২৫-০১-১০', status: 'pending' },
  { id: 'REG-003', name: 'রহিম উদ্দিন', email: 'rahim@example.com', mobile: '01533333333', institution: 'বুয়েট', submittedAt: '২০২৫-০১-০৯', status: 'pending' },
];

export const mockAllUsers = [
  { id: 'USR-001', name: 'আব্দুর রহমান', email: 'rahman@example.com', mobile: '01712345678', status: 'active', joinedDate: '২০২৫-০১-০১', coursesEnrolled: 5 },
  { id: 'USR-002', name: 'মোহাম্মদ আলী', email: 'ali@example.com', mobile: '01811111111', status: 'active', joinedDate: '২০২৫-০১-০৫', coursesEnrolled: 2 },
  { id: 'USR-003', name: 'সারা খানম', email: 'sara@example.com', mobile: '01644444444', status: 'banned', joinedDate: '২০২৪-১২-২০', coursesEnrolled: 1 },
];

export const mockDonations = [
  { id: 'DON-001', name: 'আব্দুর রহমান', mobile: '01712345678', amount: 1000, txId: 'BK2025001', method: 'bKash', status: 'verified', date: '২০২৫-০১-১০' },
  { id: 'DON-002', name: 'ফাতিমা বেগম', mobile: '01922222222', amount: 500, txId: 'NG2025002', method: 'Nagad', status: 'pending', date: '২০২৫-০১-১০' },
  { id: 'DON-003', name: 'অজ্ঞাত', mobile: '01533333333', amount: 2000, txId: 'RK2025003', method: 'Rocket', status: 'pending', date: '২০২৫-০১-০৯' },
];
