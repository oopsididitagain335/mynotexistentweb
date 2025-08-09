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
      <div className="page-home flex flex-col items-center justify-center min-h-screen px-4 text-center max-w-lg mx-auto bg-black text-white">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold leading-tight">
            Your digital identity,<br />
            simplified.
          </h1>
          <p className="mt-8 text-xl text-gray-400">
            Create stunning bio links, showcase your content, and connect with your audience. thebiolink.lol gives you the tools to build your online presence — beautifully.
          </p>
        </div>

        {/* Username Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center border border-gray-700 rounded-md overflow-hidden mb-8">
          <span className="bg-gray-800 px-4 py-3 select-none text-xl font-mono">
            thebiolink.lol/
          </span>
          <input
            type="text"
            aria-label="Enter your username"
            className="outline-none px-4 py-3 text-xl font-mono flex-grow min-w-[120px] bg-transparent text-white"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!username.trim()}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-r-md disabled:opacity-50"
          >
            Claim
          </button>
        </form>

        {/* Login Link */}
        <div className="mb-16 text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login">
            <a className="text-blue-400 hover:underline">Log in</a>
          </Link>
        </div>

        {/* Footer Section with Mockup */}
        <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
          <img
            src="/mockup.png" // Replace with your mockup image
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <p className="text-xl font-bold">Preview your profile</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
