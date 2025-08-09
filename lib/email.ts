// lib/email.ts
import nodemailer from 'nodemailer';

if (!process.env.EMAIL || !process.env.APP_PASSWORD) {
  console.warn('⚠ Email sending is disabled: Missing EMAIL or APP_PASSWORD env variables.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
  if (!process.env.EMAIL || !process.env.APP_PASSWORD) return;

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
  }
};
