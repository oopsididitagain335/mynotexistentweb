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

      <style jsx>{`
        div {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          text-align: center;
          background-color: #fff;
          color: #1a202c;
        }
        @media (prefers-color-scheme: dark) {
          div {
            background-color: #1a202c;
            color: #e2e8f0;
          }
        }
        h1 {
          font-weight: 800;
          font-size: 2.25rem;
          line-height: 1.25;
          max-width: 64rem;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 640px) {
          h1 {
            font-size: 3rem;
          }
        }
        h1 span:first-child {
          color: #6b21a8;
        }
        @media (prefers-color-scheme: dark) {
          h1 span:first-child {
            color: #a78bfa;
          }
        }
        h1 span:last-child {
          font-size: 1.125rem;
          font-weight: 500;
          color: #718096;
        }
        @media (prefers-color-scheme: dark) {
          h1 span:last-child {
            color: #a0aec0;
          }
        }
        .btn-primary {
          display: inline-block;
          padding: 0.75rem 2rem;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 0.5rem;
          background-color: #6b21a8;
          color: white;
          transition: background-color 0.2s ease;
          text-decoration: none;
        }
        .btn-primary:hover {
          background-color: #581c87;
        }
        .btn-primary:focus {
          outline: none;
          box-shadow: 0 0 0 4px #c4b5fd;
        }
        @media (prefers-color-scheme: dark) {
          .btn-primary {
            background-color: #7c3aed;
          }
          .btn-primary:hover {
            background-color: #6d28d9;
          }
          .btn-primary:focus {
            box-shadow: 0 0 0 4px #5b21b6;
          }
        }
        .btn-outline {
          display: inline-block;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          border: 1px solid #6b7280;
          color: #4b5563;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        .btn-outline:hover {
          background-color: #f3f4f6;
        }
        @media (prefers-color-scheme: dark) {
          .btn-outline {
            border-color: #9ca3af;
            color: #d1d5db;
          }
          .btn-outline:hover {
            background-color: #374151;
          }
        }
        .footer-text {
          margin-top: 4rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
        @media (prefers-color-scheme: dark) {
          .footer-text {
            color: #9ca3af;
          }
        }
      `}</style>
      </div>
    </Layout>
  );
};

export default Home;
