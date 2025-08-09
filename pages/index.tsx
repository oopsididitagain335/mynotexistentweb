// pages/index.tsx
import React, { useState } from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    router.push(`/signup?username=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
      <div className="page-home flex flex-col items-center justify-center min-h-screen px-4 text-center max-w-lg mx-auto">
        <h1 className="hero mb-12">
          <span className="text-heading block text-2xl font-semibold">
            Your Link. Your Server. Your Identity.
          </span>
          <span className="text-subhead block text-lg mt-2">
            One profile. Zero compromises.
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="flex items-center border border-gray-300 rounded-md overflow-hidden max-w-full">
          <span className="bg-gray-100 text-gray-700 px-4 py-3 select-none text-lg font-mono">
            thebiolink.lol/
          </span>
          <input
            type="text"
            aria-label="Enter your username"
            className="outline-none px-4 py-3 text-lg font-mono flex-grow min-w-[120px]"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </form>

        <button
          onClick={handleSubmit}
          disabled={!username.trim()}
          className="btn btn-primary mt-6 px-8 py-3 text-lg disabled:opacity-50"
        >
          Get Started
        </button>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login">
            <a className="text-blue-600 hover:underline">Log in</a>
          </Link>
        </div>

        <div className="mt-20 text-sm text-gray-500 dark:text-gray-400">
          Built for creators, hackers, and digital citizens.
        </div>
      </div>
    </Layout>
  );
};

export default Home;
