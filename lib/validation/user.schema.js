import { z } from 'zod';

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে').optional(),
  facebook: z.string().url('সঠিক ইউআরএল দিন').optional().or(z.literal('')),
  institution: z.string().min(2, 'প্রতিষ্ঠানের নাম আবশ্যক').optional(),
  division: z.string().min(2, 'বিভাগ নির্বাচন করুন').optional(),
  district: z.string().min(2, 'জেলা নির্বাচন করুন').optional(),
  upazila: z.string().optional(),
});

export const quizAttemptSchema = z.object({
  answer: z.number().int().min(0, 'উত্তর নির্বাচন করুন'),
});
