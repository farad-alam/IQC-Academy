import { Resend } from 'resend';

let resend;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

// Replace with your verified domain (e.g., admin@iqcacademy.com) once verified on resend.com
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'admin@iqcacademy.com';

/**
 * Sends a branded OTP email for password reset (Bengali)
 * @param {string} to  - Recipient email
 * @param {string} otp - The one-time 6-digit password
 */
export async function sendPasswordResetEmail(to, otp) {
  if (!resend) {
    console.warn(`Resend not configured. Simulated OTP for ${to}: ${otp}`);
    return;
  }

  try {
    await resend.emails.send({
      from: `IQC Academy <${FROM_EMAIL}>`,
      to,
      subject: 'IQC Academy - পাসওয়ার্ড রিসেট কোড',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0d3320, #1a5c38); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 0.5px;">🕌 IQC Academy</h1>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <h2 style="color: #1a5c38; margin-top: 0;">পাসওয়ার্ড রিসেট কোড</h2>
            <p>আস-সালামু আলাইকুম,</p>
            <p>আপনার IQC Academy অ্যাকাউন্টের পাসওয়ার্ড রিসেটের জন্য নিচের কোডটি ব্যবহার করুন:</p>

            <!-- OTP Display -->
            <div style="background: #f3f9f5; border: 2px solid #1a5c38; border-radius: 12px; padding: 28px; text-align: center; margin: 28px 0;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280; letter-spacing: 2px; text-transform: uppercase;">আপনার ভেরিফিকেশন কোড</p>
              <div style="display: inline-flex; gap: 8px; justify-content: center;">
                ${otp.split('').map(digit => `
                  <span style="
                    display: inline-block;
                    width: 44px; height: 56px;
                    background: white;
                    border: 2px solid #1a5c38;
                    border-radius: 8px;
                    font-size: 28px;
                    font-weight: 800;
                    line-height: 56px;
                    text-align: center;
                    color: #0d3320;
                    font-family: monospace;
                    box-shadow: 0 2px 6px rgba(26,92,56,0.12);
                  ">${digit}</span>
                `).join('')}
              </div>
              <p style="margin: 16px 0 0; font-size: 13px; color: #6b7280;">
                ⏱️ এই কোডটি <strong style="color: #dc2626;">১০ মিনিটের</strong> জন্য সচল
              </p>
            </div>

            <!-- Security notice -->
            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 14px 18px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>⚠️ সতর্কতা:</strong> আপনি যদি এই অনুরোধ না করে থাকেন, তাহলে এই ইমেইলটি উপেক্ষা করুন। আপনার অ্যাকাউন্ট সুরক্ষিত আছে।
              </p>
            </div>

            <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 0;">
              জাযাকাল্লাহু খাইরান,<br>
              <strong>IQC Academy টিম</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে। সরাসরি রিপ্লাই করবেন না।
            </p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
}


/**
 * Sends an approval email to the user
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 */
export async function sendApprovalEmail(to, name) {
  if (!resend) {
    console.warn(`Resend not configured. Simulated Approval Email for ${to}`);
    return;
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://iqc-academy.vercel.app';
    await resend.emails.send({
      from: `IQC Academy <${FROM_EMAIL}>`,
      to,
      subject: 'IQC Academy - আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে!',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">IQC Academy</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #16a34a; margin-top: 0;">✅ অ্যাকাউন্ট অনুমোদিত হয়েছে!</h2>
            <p>প্রিয় <strong>${name}</strong>,</p>
            <p>আস-সালামু আলাইকুম। আপনার IQC Academy অ্যাকাউন্টটি সফলভাবে অনুমোদিত হয়েছে। এখন আপনি আমাদের সকল কোর্সে ভর্তি হতে পারবেন।</p>
            <div style="margin: 32px 0; text-align: center;">
              <a href="${appUrl}/courses" style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                কোর্স দেখুন →
              </a>
            </div>
            <p style="color: #6b7280; font-size: 0.9rem;">জাযাকাল্লাহু খাইরান,<br>IQC Academy টিম</p>
          </div>
        </div>
      `
    });
    console.log(`[EMAIL] Approval email sent to ${to}`);
  } catch (error) {
    // Log but don't throw — email failure should not roll back user approval
    console.error('[EMAIL] Approval email send error:', error?.message || error);
  }
}

/**
 * Sends a payment approval email to the student
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} courseTitle - Course title
 */
export async function sendPaymentApprovedEmail(to, name, courseTitle) {
  if (!resend) {
    console.warn(`Resend not configured. Simulated Payment Approved Email for ${to}`);
    return;
  }
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://iqc-academy.vercel.app';
    await resend.emails.send({
      from: `IQC Academy <${FROM_EMAIL}>`,
      to,
      subject: `IQC Academy - আপনার পেমেন্ট অনুমোদিত হয়েছে!`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0d3320, #1a5c38); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🕌 IQC Academy</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #16a34a; margin-top: 0;">✅ পেমেন্ট অনুমোদিত হয়েছে!</h2>
            <p>প্রিয় <strong>${name}</strong>,</p>
            <p>আস-সালামু আলাইকুম। আপনার <strong>${courseTitle}</strong> কোর্সের পেমেন্ট সফলভাবে যাচাই ও অনুমোদিত হয়েছে। এখন আপনি কোর্সটি সম্পূর্ণরূপে অ্যাক্সেস করতে পারবেন।</p>
            <div style="margin: 32px 0; text-align: center;">
              <a href="${appUrl}/dashboard" style="background-color: #16a34a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                কোর্স শুরু করুন →
              </a>
            </div>
            <p style="color: #6b7280; font-size: 0.9rem;">জাযাকাল্লাহু খাইরান,<br>IQC Academy টিম</p>
          </div>
        </div>
      `
    });
    console.log(`[EMAIL] Payment approved email sent to ${to}`);
  } catch (error) {
    console.error('[EMAIL] Payment approved email error:', error?.message || error);
  }
}

/**
 * Sends a payment rejection email to the student
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} courseTitle - Course title
 * @param {string} reason - Rejection reason
 */
export async function sendPaymentRejectedEmail(to, name, courseTitle, reason) {
  if (!resend) {
    console.warn(`Resend not configured. Simulated Payment Rejected Email for ${to}`);
    return;
  }
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://iqc-academy.vercel.app';
    await resend.emails.send({
      from: `IQC Academy <${FROM_EMAIL}>`,
      to,
      subject: `IQC Academy - আপনার পেমেন্ট প্রত্যাখ্যাত হয়েছে`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0d3320, #1a5c38); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🕌 IQC Academy</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #dc2626; margin-top: 0;">❌ পেমেন্ট প্রত্যাখ্যাত হয়েছে</h2>
            <p>প্রিয় <strong>${name}</strong>,</p>
            <p>আস-সালামু আলাইকুম। দুঃখিত, আপনার <strong>${courseTitle}</strong> কোর্সের পেমেন্টটি যাচাই করা সম্ভব হয়নি।</p>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <strong style="color: #dc2626;">কারণ:</strong>
              <p style="margin: 8px 0 0; color: #7f1d1d;">${reason || 'পেমেন্ট তথ্য যাচাই করা যায়নি।'}</p>
            </div>
            <p>আপনি পুনরায় সঠিক তথ্য দিয়ে পেমেন্ট সাবমিট করতে পারবেন।</p>
            <div style="margin: 32px 0; text-align: center;">
              <a href="${appUrl}/dashboard" style="background-color: #dc2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                পুনরায় পেমেন্ট করুন →
              </a>
            </div>
            <p style="color: #6b7280; font-size: 0.9rem;">সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।<br>IQC Academy টিম</p>
          </div>
        </div>
      `
    });
    console.log(`[EMAIL] Payment rejected email sent to ${to}`);
  } catch (error) {
    console.error('[EMAIL] Payment rejected email error:', error?.message || error);
  }
}

/**
 * Sends an invitation email to a newly created admin
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} password - The auto-generated password
 */
export async function sendAdminInviteEmail(to, name, password) {
  if (!resend) {
    console.warn(`Resend not configured. Simulated Admin Invite Email for ${to} with password: ${password}`);
    return;
  }
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://iqc-academy.vercel.app';
    const loginUrl = `${appUrl}/admin/login`;
    await resend.emails.send({
      from: `IQC Academy <${FROM_EMAIL}>`,
      to,
      subject: `IQC Academy - আপনাকে Admin হিসেবে যোগ করা হয়েছে`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">IQC Academy</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #2563eb; margin-top: 0;">আপনাকে Admin প্যানেলে স্বাগত!</h2>
            <p>প্রিয় <strong>${name}</strong>,</p>
            <p>আস-সালামু আলাইকুম। আপনাকে IQC Academy-এর এডমিন হিসেবে যুক্ত করা হয়েছে。</p>
            
            <div style="background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #4b5563; font-size: 16px;">লগইন তথ্য:</h3>
              <p style="margin: 8px 0;"><strong>ইমেইল:</strong> ${to}</p>
              <p style="margin: 8px 0;"><strong>পাসওয়ার্ড:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 18px; color: #111827;">${password}</code></p>
            </div>
            
            <div style="margin: 32px 0; text-align: center;">
              <a href="${loginUrl}" style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                এডমিন প্যানেলে লগইন করুন →
              </a>
            </div>
            
            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>সতর্কতা:</strong> আপনার অ্যাকাউন্টের নিরাপত্তার জন্য প্রথমবার লগইন করার পর পাসওয়ার্ড পরিবর্তন করার অনুরোধ করা হচ্ছে।
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 0;">জাযাকাল্লাহু খাইরান,<br>IQC Academy টিম</p>
          </div>
        </div>
      `
    });
    console.log(`[EMAIL] Admin invite email sent to ${to}`);
  } catch (error) {
    console.error('[EMAIL] Admin invite email error:', error?.message || error);
  }
}
