// lib/email.ts
import nodemailer from 'nodemailer';

// Warn if email sending is disabled
if (!process.env.EMAIL || !process.env.APP_PASSWORD) {
  console.warn(
    '⚠ Email sending is disabled: Missing EMAIL or APP_PASSWORD env variables.'
  );
}

// Initialize transporter only if credentials are available
let transporter: any = null;

if (process.env.EMAIL && process.env.APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> => {
  // Exit early if credentials are missing
  if (!transporter) {
    console.error('❌ Cannot send email: Missing credentials.');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"thebiolink.lol" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    // Log detailed error information
    console.error('📧 Failed to send email:', error);
    if (error.response) {
      console.error('Server response:', error.response);
    }
  }
};
