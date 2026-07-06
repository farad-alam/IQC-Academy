import { z } from 'zod';

export const donationSchema = z.object({
  name: z.string().optional(),
  mobile: z.string().regex(/^01\d{9}$/, 'সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন'),
  amount: z.number().positive('পরিমাণ সঠিক নয়'),
  txId: z.string().min(5, 'সঠিক ট্রানজেকশন আইডি দিন'),
  method: z.enum(['BKASH', 'NAGAD', 'ROCKET', 'BANK', 'OTHER'], {
    errorMap: () => ({ message: 'সঠিক পেমেন্ট মাধ্যম নির্বাচন করুন' })
  }),
});
