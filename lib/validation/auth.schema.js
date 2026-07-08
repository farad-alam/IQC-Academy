import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে')
    .max(60, 'নাম সর্বোচ্চ ৬০ অক্ষরের হতে হবে')
    .regex(/^[\u0980-\u09FFa-zA-Z\s.'-]+$/, 'নাম শুধুমাত্র বাংলা বা ইংরেজি অক্ষরে হবে'),
  mobile: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'সঠিক ১১-ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন'),
  email: z
    .string()
    .email('সঠিক ইমেইল ঠিকানা দিন')
    .max(100, 'ইমেইল অনেক বড়'),
  facebook: z
    .string()
    .url('সঠিক ফেসবুক ইউআরএল দিন (https://... দিয়ে শুরু হবে)')
    .optional()
    .or(z.literal('')),
  institution: z
    .string()
    .min(2, 'প্রতিষ্ঠানের নাম আবশ্যক')
    .max(100, 'নাম অনেক বড়'),
  division: z.string().min(2, 'বিভাগ নির্বাচন করুন'),
  district: z
    .string()
    .min(2, 'জেলার নাম আবশ্যক')
    .max(50, 'জেলার নাম অনেক বড়'),
  upazila: z.string().max(50).optional(),
  dob: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: 'সঠিক জন্মতারিখ দিন' })
    .refine(
      (date) => {
        const d = new Date(date);
        const now = new Date();
        const age = now.getFullYear() - d.getFullYear();
        return d < now && age >= 8 && age <= 100;
      },
      { message: 'বয়স ৮ থেকে ১০০ বছরের মধ্যে হতে হবে' }
    ),
  sscYear: z
    .string()
    .regex(/^\d{4}$/, 'পাশের সাল ৪ ডিজিটের হতে হবে')
    .refine(
      (y) => {
        const yr = parseInt(y, 10);
        return yr >= 1990 && yr <= currentYear + 1;
      },
      { message: `সাল ১৯৯০ থেকে ${currentYear + 1} এর মধ্যে হতে হবে` }
    ),
  sscBoard: z
    .string()
    .regex(/^[\u0980-\u09FFa-zA-Z\s]+$/, 'বোর্ডের নাম শুধু অক্ষরে হবে (যেমন: Dhaka, Rajshahi)')
    .max(30)
    .optional()
    .or(z.literal('')),
  sscGpa: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'জিপিএ শুধু সংখ্যায় হবে (যেমন: 5.00 বা 4.26)')
    .refine(
      (g) => {
        if (!g || g.trim() === '') return true;
        const num = parseFloat(g);
        return !isNaN(num) && num >= 0 && num <= 5.0;
      },
      { message: 'জিপিএ ০.০০ থেকে ৫.০০ এর মধ্যে হতে হবে' }
    )
    .optional()
    .or(z.literal('')),
  whatsapp: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'সঠিক ১১-ডিজিটের WhatsApp নম্বর দিন'),
  password: z
    .string()
    .min(8, 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে')
    .max(64, 'পাসওয়ার্ড অনেক বড়')
    .regex(/[A-Z]/, 'পাসওয়ার্ডে কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে')
    .regex(/[0-9]/, 'পাসওয়ার্ডে কমপক্ষে একটি সংখ্যা থাকতে হবে'),
});

export const loginSchema = z.object({
  email: z.string().email('সঠিক ইমেইল দিন'),
  password: z.string().min(1, 'পাসওয়ার্ড দিন'),
});
