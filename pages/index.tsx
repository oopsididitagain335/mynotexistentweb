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
    if (!username.trim()) return; // simple validation
    router.push(`/signup?username=${encodeURIComponent(username.trim())}`);
  };

  return (
    <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
      <div className="page-home text-center max-w-md mx-auto px-4">
        <h1 className="hero mb-8">
          <span className="text-heading">
            Your Link. Your Server. Your Identity.
          </span>
          <br />
          <span className="text-subhead">One profile. Zero compromises.</span>
        </h1>

        {/* Username input bar */}
        <form onSubmit={handleSubmit} className="flex justify-center items-center gap-2 max-w-full">
          <input
            type="text"
            placeholder="yourusername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-l-md px-4 py-3 text-lg flex-grow min-w-[150px]"
            autoComplete="off"
            spellCheck={false}
            aria-label="Enter your username"
          />
          <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-4 py-3 text-lg select-none">
            .thebiolink.lol
          </span>
          <button
            type="submit"
            className="btn btn-primary px-6 py-3 text-lg rounded-md ml-3"
            disabled={!username.trim()}
          >
            Get Started
          </button>
        </form>

        {/* Already have account */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login">
            <a className="text-blue-600 hover:underline">Log in</a>
          </Link>
        </div>

        {/* Original buttons removed, since username bar has Get Started now */}
        <div className="mt-16 text-sm text-gray-500 dark:text-gray-400">
          Built for creators, hackers, and digital citizens.
        </div>
      </div>
    </Layout>
  );
};

export default Home;
