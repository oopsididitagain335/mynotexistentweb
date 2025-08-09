// pages/index.tsx
import React from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
      <div className="page-home text-center">
        <h1 className="hero">
          <span className="text-heading">Your Link. Your Server. Your Identity.</span>
          <br />
          <span className="text-subhead">One profile. Zero compromises.</span>
        </h1>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup">
            <a className="btn btn-primary px-8 py-3 text-lg">Get Started</a>
          </Link>
          <Link href="/login">
            <a className="btn btn-outline px-8 py-3">Log In</a>
          </Link>
        </div>

        <div className="mt-16 text-sm text-gray-500 dark:text-gray-400">
          Built for creators, hackers, and digital citizens.
        </div>
      </div>
    </Layout>
  );
};

export default Home;
