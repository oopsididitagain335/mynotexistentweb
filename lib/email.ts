// lib/email.ts
import nodemailer from 'nodemailer';

// Warn if email credentials are missing
if (!process.env.EMAIL || !process.env.APP_PASSWORD) {
  console.warn('⚠ Email sending is disabled: Missing EMAIL or APP_PASSWORD env variables.');
}

// Initialize transporter only if credentials are available
let transporter: nodemailer.Transporter | null = null;

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

export const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
  if (!transporter) {
    console.error('❌ Cannot send email: Missing or invalid email configuration.');
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
    console.error('📧 Failed to send email:', error);
    if ((error as any).response) {
      console.error('📧 SMTP Response:', (error as any).response);
    }
  }
};
