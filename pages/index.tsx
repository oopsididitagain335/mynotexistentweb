import React, { useState, useEffect, useRef } from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    router.push(`/signup?username=${encodeURIComponent(trimmed)}`);
  };

  // Cursor glow follow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glow = cursorGlowRef.current;
      if (!glow) return;

      requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
        glow.style.opacity = '0.4';
      });
    };

    const handleMouseLeave = () => {
      const glow = cursorGlowRef.current;
      if (glow) glow.style.opacity = '0';
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
        {/* Dynamic Cursor Glow */}
        <div
          ref={cursorGlowRef}
          className="cursor-glow fixed w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full pointer-events-none opacity-0 transition-opacity duration-500 blur-3xl z-0"
        />

        {/* Abstract Floating Shapes (Background Elements) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="shape-1 absolute w-72 h-72 bg-gradient-to-r from-green-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="shape-2 absolute w-96 h-96 bg-gradient-to-l from-indigo-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="shape-3 absolute w-80 h-80 bg-gradient-to-r from-purple-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
          {/* Header */}
          <header className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-bounce-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">the</span>
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">biolink</span>
                <span className="text-gray-500">.lol</span>
              </h1>
            </div>

            <nav className="hidden md:flex gap-7">
              {['Home', 'Links', 'Pro', 'Login'].map((item) => (
                <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}>
                  <a className="text-gray-300 hover:text-green-400 transition-all duration-300 font-medium relative group">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </Link>
              ))}
              <Link href="https://discord.gg/Kkdbqu4H6M" target="_blank" rel="noopener noreferrer">
                <a className="flex items-center gap-2 bg-transparent text-white px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10 backdrop-blur-sm hover:bg-green-500/20 hover:border-green-500/60 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-green-500/20">
                  <svg className="w-4 h-4" fill="#5865F2" viewBox="0 0 24 24">
                    <path d="M20.317 4.492a18.613 18.613 0 0 0-4.82-1.51c-.17-.02-.34-.03-.51-.03-3.42 0-6.2 1.7-8.98 1.7-2.77 0-5.55-1.7-8.97-1.7-.18 0-.35.01-.52.03a18.5 18.5 0 0 0-4.822 1.51 28.52 28.52 0 0 0-.31 11.18c3.08 2.22 6.01 3.19 8.98 3.98v-4.31c-1.31-.6-2.41-1.36-3.26-2.31.44-.65.85-1.34 1.22-2.07 2.06.97 4.2 1.49 6.39 1.49 2.19 0 4.33-.52 6.39-1.49.37.73.78 1.42 1.22 2.07-.85.95-1.95 1.71-3.26 2.31v4.31c2.97-.79 5.9-1.76 8.98-3.98a28.5 28.5 0 0 0-.31-11.18zM7.5 14.09c-1.08 0-1.97-.9-1.97-2.02 0-1.11.89-2.02 1.97-2.02s1.97.91 1.97 2.02c0 1.11-.89 2.02-1.97 2.02zm8.98 0c-1.08 0-1.97-.9-1.97-2.02 0-1.11.89-2.02 1.97-2.02s1.97.91 1.97 2.02c0 1.11-.89 2.02-1.97 2.02z"/>
                  </svg>
                  Join
                </a>
              </Link>
            </nav>
          </header>

          {/* Main Hero */}
          <main className="flex flex-col items-center justify-center py-16 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              Your identity.
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">Your consequences.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              One link to rule them all. Bio links, file hosting, analytics — all in one blazing-fast, secure hub.
            </p>

            {/* Username Claim Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 flex items-center border border-gray-600 rounded-full bg-gray-900/70 backdrop-blur-sm overflow-hidden focus-within:border-green-500 transition-colors">
                  <span className="px-5 py-4 text-green-400 text-sm font-mono bg-gray-800/70 border-r border-gray-600">
                    thebiolink.lol/
                  </span>
                  <input
                    type="text"
                    aria-label="Choose your username"
                    className="flex-1 outline-none px-5 py-4 bg-transparent text-white placeholder-gray-500 font-mono text-sm"
                    placeholder="yourname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!username.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
                >
                  Claim →
                </button>
              </div>
            </form>

            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login">
                <a className="text-green-400 hover:underline transition-colors font-medium">Log in</a>
              </Link>
            </p>
          </main>

          {/* Preview Section */}
          <section className="mt-24 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 transform transition-transform duration-700 hover:scale-[1.01]">
              <img
                src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Biolink Dashboard Preview"
                className="w-full h-auto block"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-1 flex bg-gradient-to-r from-green-500 to-purple-500 rounded-full blur-sm animate-pulse"></div>
          </section>

          {/* Features Grid (Optional Add-on) */}
          <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                title: 'Bio Links',
                desc: 'Link everything — socials, portfolios, stores — in one beautiful, customizable page.',
                icon: (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                ),
              },
              {
                title: 'File Hosting',
                desc: 'Upload and share files fast. No login required. Secure & private.',
                icon: (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h7v7h7v12H6z"/>
                  </svg>
                ),
              },
              {
                title: 'Real Analytics',
                desc: 'Track clicks, sources, and devices — no fluff, just data that matters.',
                icon: (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-gray-900/40 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 backdrop-blur-sm">
                <div className="text-green-400 mb-4 inline-block group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Global Styles */}
        <style jsx>{`
          .animate-bounce-slow {
            animation: bounce 3s ease-in-out infinite;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }

          .shape-1 { top: 10%; left: 10%; }
          .shape-2 { bottom: 15%; right: 10%; }
          .shape-3 { top: 50%; left: 50%; transform: translate(-50%, -50%); }

          @media (max-width: 768px) {
            nav { display: none; }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Home;
