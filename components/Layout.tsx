// components/Layout.tsx
import React from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import BottomNav from './BottomNav';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  noNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'thebiolink.lol', noNav = false }) => {
  const { userProfile } = useAuth();
  const { darkMode } = useTheme();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content="Your Link. Your Server. Your Identity. Your Consequences." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content={darkMode ? '#111827' : '#7C3AED'} />
      </Head>
      <div className="screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <main className="screen-body">{children}</main>
        {!noNav && userProfile && <BottomNav />}
      </div>
    </>
  );
};

export default Layout;
