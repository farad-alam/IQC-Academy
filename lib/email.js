import { Resend } from 'resend';

let resend;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = 'no-reply@iqcacademy.com'; // This must be a verified domain in Resend

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
    await resend.emails.send({
      from: `IQC Academy <${FROM_EMAIL}>`,
      to,
      subject: 'IQC Academy - Account Approved!',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #333;">
          <h2 style="color: #22c55e;">Account Approved!</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Assalamu Alaikum. We are happy to inform you that your IQC Academy account has been successfully approved by the administration.</p>
          <p>You can now log in and enroll in courses.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Log In Now</a>
          </div>
          <p>Jazakallah Khair,<br>The IQC Academy Team</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Approval Email send error:', error);
    throw new Error('Failed to send approval email');
  }
}
