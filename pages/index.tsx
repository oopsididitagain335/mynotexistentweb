// pages/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    router.push(`/signup?username=${encodeURIComponent(trimmed)}`);
  };

  // Only run on client side
  useEffect(() => {
    setIsClient(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Prevent hydration mismatch warnings
  if (!isClient) {
    return (
      <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#1a1a2e] to-[#16213e] text-white flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
      <div className="page-home min-h-screen px-4 bg-gradient-to-br from-[#0a0e17] via-[#1a1a2e] to-[#16213e] text-white overflow-hidden relative">
        {/* Cursor Glow Effect - only on client side */}
        <div 
          ref={cursorGlowRef}
          className="cursor-glow fixed w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full pointer-events-none opacity-0 transition-opacity duration-600 blur-3xl z-0"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
            opacity: 1
          }}
        ></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Content Container */}
        <div className="container mx-auto max-w-6xl px-6 py-8 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">the</span>
                <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">biolink</span>
                <span className="text-gray-400">.lol</span>
              </h1>
            </div>
            
            <nav className="flex gap-8">
              <Link href="/">
                <a className="text-gray-300 hover:text-green-400 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full">
                  Home
                </a>
              </Link>
              <Link href="/links">
                <a className="text-gray-300 hover:text-green-400 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full">
                  Links
                </a>
              </Link>
              <Link href="/pro">
                <a className="text-gray-300 hover:text-green-400 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full">
                  Pro
                </a>
              </Link>
              <Link href="/login">
                <a className="text-gray-300 hover:text-green-400 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full">
                  Login
                </a>
              </Link>
              <Link href="https://discord.gg/Kkdbqu4H6M" target="_blank" rel="noopener noreferrer">
                <a className="flex items-center gap-2 bg-transparent text-white px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10 backdrop-filter backdrop-blur-sm transition-all duration-300 hover:bg-green-500/20 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20">
                  <svg className="w-4 h-4" fill="#5865F2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20.317 4.492a18.613 18.613 0 0 0-4.82-1.51c-.17-.02-.34-.03-.51-.03-3.42 0-6.2 1.7-8.98 1.7-2.77 0-5.55-1.7-8.97-1.7-.18 0-.35.01-.52.03a18.5 18.5 0 0 0-4.822 1.51 28.52 28.52 0 0 0-.31 11.18c3.08 2.22 6.01 3.19 8.98 3.98v-4.31c-1.31-.6-2.41-1.36-3.26-2.31.44-.65.85-1.34 1.22-2.07 2.06.97 4.2 1.49 6.39 1.49 2.19 0 4.33-.52 6.39-1.49.37.73.78 1.42 1.22 2.07-.85.95-1.95 1.71-3.26 2.31v4.31c2.97-.79 5.9-1.76 8.98-3.98a28.5 28.5 0 0 0-.31-11.18zM7.5 14.09c-1.08 0-1.97-.9-1.97-2.02 0-1.11.89-2.02 1.97-2.02s1.97.91 1.97 2.02c0 1.11-.89 2.02-1.97 2.02zm8.98 0c-1.08 0-1.97-.9-1.97-2.02 0-1.11.89-2.02 1.97-2.02s1.97.91 1.97 2.02c0 1.11-.89 2.02-1.97 2.02z"/>
                  </svg>
                  Community
                </a>
              </Link>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex flex-col items-center justify-center flex-grow py-12">
            {/* Hero Section */}
            <section className="text-center mb-16 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Your digital identity,
                <br />
                <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">simplified</span>.
              </h1>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Create stunning bio links, showcase your content, and connect with your audience. thebiolink.lol gives you the tools to build your online presence — beautifully.
              </p>

              {/* Discord Community CTA */}
              <div className="mb-12 p-6 bg-gradient-to-r from-green-500/10 to-indigo-500/10 rounded-2xl border border-green-500/20 max-w-2xl mx-auto backdrop-filter backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-3 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="#5865F2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20.317 4.492a18.613 18.613 0 0 0-4.82-1.51c-.17-.02-.34-.03-.51-.03-3.42 0-6.2 1.7-8.98 1.7-2.77 0-5.55-1.7-8.97-1.7-.18 0-.35.01-.52.03a18.5 18.5 0 0 0-4.822 1.51 28.52 28.52 0 0 0-.31 11.18c3.08 2.22 6.01 3.19 8.98 3.98v-4.31c-1.31-.6-2.41-1.36-3.26-2.31.44-.65.85-1.34 1.22-2.07 2.06.97 4.2 1.49 6.39 1.49 2.19 0 4.33-.52 6.39-1.49.37.73.78 1.42 1.22 2.07-.85.95-1.95 1.71-3.26 2.31v4.31c2.97-.79 5.9-1.76 8.98-3.98a28.5 28.5 0 0 0-.31-11.18zM7.5 14.09c-1.08 0-1.97-.9-1.97-2.02 0-1.11.89-2.02 1.97-2.02s1.97.91 1.97 2.02c0 1.11-.89 2.02-1.97 2.02zm8.98 0c-1.08 0-1.97-.9-1.97-2.02 0-1.11.89-2.02 1.97-2.02s1.97.91 1.97 2.02c0 1.11-.89 2.02-1.97 2.02z"/>
                  </svg>
                  Join Our Community
                </h3>
                <p className="text-gray-300 mb-4">
                  Connect with other creators, get support, and stay updated on new features in our official Discord server.
                </p>
                <a 
                  href="https://discord.gg/Kkdbqu4H6M" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-[#5865F2] hover:bg-[#4d5ac9] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:translate-y-[-3px] hover:shadow-lg hover:shadow-[#5865F2]/30"
                >
                  Join Discord Server
                </a>
              </div>

              {/* Username Input Form */}
              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 max-w-md mx-auto">
                <div className="w-full flex items-center border border-gray-600 rounded-full overflow-hidden bg-gray-800/50 backdrop-filter backdrop-blur-sm">
                  <div className="px-6 py-4 bg-gray-700/70 border-r border-gray-600 font-mono text-green-400 text-sm md:text-base">
                    thebiolink.lol/
                  </div>
                  <input
                    type="text"
                    aria-label="Enter your username"
                    className="outline-none px-6 py-4 text-white flex-grow font-mono text-sm md:text-base bg-transparent placeholder-gray-500"
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
                  className="w-full bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 transform hover:translate-y-[-3px] disabled:opacity-50 disabled:transform-none"
                >
                  Claim Your Link →
                </button>
              </form>

              <div className="mt-6 text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/login">
                  <a className="text-green-400 hover:underline transition-colors">Log in</a>
                </Link>
              </div>
            </section>

            {/* Hero Image */}
            <div className="relative w-full max-w-5xl mx-auto mt-12">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 transform transition-transform duration-500 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e792c7b3c7783a09730c25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                  alt="thebiolink.lol Platform Preview" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-20 pt-8 pb-6 text-center text-gray-500 text-sm border-t border-gray-800">
            Built for creators, hackers, and digital citizens.
          </footer>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 0.9; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-pulse {
          animation: pulse 20s infinite alternate;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
