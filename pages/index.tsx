import React, { useState, useEffect } from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    window.location.href = `/signup?username=${encodeURIComponent(trimmed)}`;
  };

  // Cursor glow follow effect
  useEffect(() => {
    const cursorGlow = document.querySelector('.cursor-glow') as HTMLElement;
    if (!cursorGlow) return;

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
        cursorGlow.style.opacity = '0.3';
      });
    };

    const handleMouseLeave = () => {
      cursorGlow.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
      <div className="page-home min-h-screen bg-black text-white overflow-hidden relative">
        {/* Cursor Glow */}
        <div className="cursor-glow fixed w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full pointer-events-none opacity-0 transition-opacity duration-500 blur-3xl z-0"></div>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-20 md:py-40 px-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-center">
            Everything you want,
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">right here.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed text-center">
            thebiolink.lol is your go-to for modern, feature-rich bio links and fast, secure file hosting. Everything you need — right here.
          </p>

          {/* Username Claim Form */}
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 max-w-md w-full">
            <div className="w-full flex items-center border border-gray-600 rounded-full overflow-hidden bg-gray-900/70 backdrop-blur-sm">
              <span className="px-5 py-4 text-green-400 text-sm font-mono bg-gray-800/70 border-r border-gray-600">
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
            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Claim Now →
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login">
              <a className="text-green-400 hover:underline transition-colors">Log in</a>
            </Link>
          </div>
        </section>

        {/* Feature Mockups */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto px-6 pb-20">
          {/* Laptop Mockup */}
          <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-gray-800 bg-gray-900/70 backdrop-blur-sm">
            <img
              src="https://source.unsplash.com/random/800x600/?dashboard"
              alt="Dashboard Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div>
                <h3 className="text-xl font-bold mb-2">Your Dashboard</h3>
                <p className="text-sm">Manage links, files, and analytics effortlessly.</p>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-gray-800 bg-gray-900/70 backdrop-blur-sm">
            <img
              src="https://source.unsplash.com/random/800x600/?mobile"
              alt="Mobile Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div>
                <h3 className="text-xl font-bold mb-2">On-the-go Access</h3>
                <p className="text-sm">Access your links and files anytime, anywhere.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

// ✅ Only one default export — and it's at the end, alone
export default Home;
