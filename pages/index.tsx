import React from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
      <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="font-extrabold text-4xl sm:text-5xl leading-tight max-w-4xl mx-auto">
          <span className="text-purple-700 dark:text-purple-400">Your Link. Your Server. Your Identity.</span>
          <br />
          <span className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium">
            One profile. Zero compromises.
          </span>
        </h1>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup" passHref>
            <a className="inline-block px-8 py-3 text-lg font-semibold rounded-lg bg-purple-700 text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 transition">
              Get Started
            </a>
          </Link>
          <Link href="/login" passHref>
            <a className="inline-block px-8 py-3 rounded-lg border border-gray-500 text-gray-700 hover:bg-gray-100 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-700 transition">
              Log In
            </a>
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
