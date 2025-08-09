'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    window.location.href = `/signup?username=${encodeURIComponent(trimmed)}`;
  };

  // Cursor Glow Effect
  useEffect(() => {
    const glow = cursorGlowRef.current;
    if (!glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
        glow.style.opacity = '0.3';
      });
    };

    const handleMouseLeave = () => {
      glow.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Cursor Glow */}
      <div
        ref={cursorGlowRef}
        className="pointer-events-none fixed w-96 h-96 rounded-full blur-3xl opacity-0 transition-opacity duration-500 z-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Floating Depth Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 mb-6 opacity-90">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.3a1 1 0 00-1.4 0l-4 4a1 1 0 101.4 1.4L10 4.05V15a1 1 0 102 0V4.05l2.7 2.65a1 1 0 001.4-1.4l-4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-white">the</span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              biolink
            </span>
            <span className="text-gray-500">.lol</span>
          </h1>
        </div>

        {/* Hero Heading */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 max-w-3xl">
          Your identity.
          <br />
          <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            Your consequences.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
          One link for everything. Bio links, file hosting, and analytics — all in one secure hub.
        </p>

        {/* Username Claim Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Static Prefix + Input */}
            <div className="flex-1 flex items-center border border-gray-700 rounded-full bg-gray-900/70 backdrop-blur-sm overflow-hidden focus-within:border-green-500 transition-colors">
              <span className="px-5 py-4 text-green-400 text-sm font-mono bg-gray-800/70 border-r border-gray-700 whitespace-nowrap">
                thebiolink.lol/
              </span>
              <input
                type="text"
                aria-label="Choose your username"
                className="flex-1 outline-none px-5 py-4 bg-transparent text-white placeholder-gray-500 font-mono text-sm"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                spellCheck={false}
                autoComplete="off"
              />
            </div>

            {/* Claim Button */}
            <button
              type="submit"
              disabled={!username.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/20"
            >
              Claim →
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-green-400 hover:underline font-medium transition-colors">
            Log in
          </Link>
        </p>
      </main>

      {/* Global Styles */}
      <style jsx>{`
        .cursor-glow {
          transform: translate(-50%, -50%);
        }

        @media (max-width: 640px) {
          .flex-1 {
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}
