import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
  mobile: z.string().regex(/^01\d{9}$/, 'সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন'),
  email: z.string().email('সঠিক ইমেইল দিন'),
  facebook: z.string().url('সঠিক ইউআরএল দিন').optional().or(z.literal('')),
  institution: z.string().min(2, 'প্রতিষ্ঠানের নাম আবশ্যক'),
  division: z.string().min(2, 'বিভাগ নির্বাচন করুন'),
  district: z.string().min(2, 'জেলা নির্বাচন করুন'),
  upazila: z.string().optional(),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'সঠিক তারিখ দিন' }),
  sscYear: z.string().min(4, 'এসএসসি পাশের সাল আবশ্যক'),
  sscBoard: z.string().optional(),
  sscGpa: z.string().optional(),
  whatsapp: z.string().regex(/^01\d{9}$/, 'সঠিক WhatsApp নম্বর দিন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে'),
});

export const loginSchema = z.object({
  email: z.string().email('সঠিক ইমেইল দিন'),
  password: z.string().min(1, 'পাসওয়ার্ড দিন'),
});
