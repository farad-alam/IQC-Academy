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
