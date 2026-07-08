import { Resend } from 'resend';

let resend;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

// Use Resend's sandbox "onboarding" domain if no custom domain is verified yet.
// Replace with your verified domain (e.g., no-reply@iqcacademy.com) once verified on resend.com
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Sends an OTP email to the user
 * @param {string} to - Recipient email
 * @param {string} otp - The one-time password
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
      subject: 'IQC Academy - Password Reset',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Use the following code to proceed:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
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


