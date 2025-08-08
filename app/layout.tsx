import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'mybio - Claim Your Link',
  description: 'Sign up and claim your bio link.',
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
