'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Real-time validation
  const isValid = /^[a-zA-Z0-9_-]{3,20}$/.test(username.trim());

  // Cursor glow effect
  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset after 3s
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Full gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0" />

      {/* Cursor Glow */}
      <div
        className="pointer-events-none fixed w-96 h-96 rounded-full blur-3xl opacity-20 transition-opacity duration-700 z-0"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(139, 92, 246, 0.2), transparent 40%)',
        }}
        onMouseMove={(e) => {
          const { clientX, clientY } = e;
          e.currentTarget.style.setProperty('--x', `${clientX}px`);
          e.currentTarget.style.setProperty('--y', `${clientY}px`);
        }}
      />

      {/* Floating Orbs (Depth) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute rounded-full opacity-3 blur-3xl animate-pulse"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, #6366f1, transparent)',
            top: '10%',
            left: '70%',
            animationDelay: '0s',
            animationDuration: '8s',
          }}
        />
        <div
          className="absolute rounded-full opacity-3 blur-3xl animate-pulse"
          style={{
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, #8b5cf6, transparent)',
            top: '60%',
            left: '10%',
            animationDelay: '2s',
            animationDuration: '8s',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-black">the</span>
          <span className="text-2xl font-black bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            biolink
          </span>
          <span className="text-2xl text-gray-500">.lol</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/help" className="text-gray-300 hover:text-white transition">
            Help Center
          </Link>
          <Link href="https://discord.gg" target="_blank" className="text-gray-300 hover:text-white transition">
            Discord
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition">
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-gray-300 hover:text-green-400 hover:underline transition underline-offset-2"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 py-12 flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
          Everything you want,
          <br />
          <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            right here.
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
          One secure link for your bio, files, socials, and analytics. Claim your identity. Own your consequences.
        </p>

        {/* Claim Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-3 font-mono text-sm sm:text-base">
              <span className="text-green-400">thebiolink.lol/</span>
            </div>
            <div className="flex-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                aria-label="Choose your username"
                className={`w-full bg-transparent border border-gray-700 rounded-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all font-mono text-sm sm:text-base ${
                  username && !isValid ? 'border-red-600' : ''
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-800 disabled:to-gray-900 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed min-w-32 text-sm"
            >
              {isSubmitting ? '...' : 'Claim'}
            </button>
          </div>
        </form>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-up">
            ✅ Successfully claimed <strong>thebiolink.lol/{username}</strong>
          </div>
        )}

        {/* Login Link (Mobile) */}
        <p className="text-sm text-gray-500 mt-4 md:hidden">
          Already have an account?{' '}
          <Link href="/login" className="text-green-400 hover:underline">
            Log in
          </Link>
        </p>
      </main>

      {/* Device Mockups (Floating) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 flex justify-center">
        <div className="relative w-full max-w-3xl aspect-video">
          {/* Laptop */}
          <div
            className="absolute top-0 left-1/4 transform -translate-x-1/2 animate-float"
            style={{ animationDelay: '0s' }}
          >
            <div className="w-72 h-48 bg-gray-900 border border-gray-700 rounded-t-xl rounded-b-sm shadow-2xl overflow-hidden">
              <div className="h-6 bg-gray-800 flex items-center px-2 space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="p-4 text-xs text-gray-300 font-mono">
                <div>~ $ thebiolink.lol/{username || 'yourname'}</div>
                <div className="mt-2">Bio • Files • Socials • Analytics</div>
                <div className="mt-1 text-green-400">✓ Secure • Encrypted • Yours</div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div
            className="absolute top-16 right-1/4 transform translate-x-1/2 animate-float"
            style={{ animationDelay: '1.5s' }}
          >
            <div className="w-36 h-64 bg-black border-2 border-gray-700 rounded-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"></div>
              <div className="p-3 text-xs text-gray-300 font-mono h-full flex flex-col">
                <div className="flex justify-between text-xs mb-2">
                  <span>9:41</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-gray-500"></div>
                    <div className="w-1 h-3 bg-gray-500"></div>
                    <div className="w-1 h-3 bg-gray-500"></div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-400 rounded-full"></div>
                  <div className="text-white font-bold">{username || 'yourname'}</div>
                  <div className="text-gray-400">+3 links</div>
                  <div className="text-green-400 text-xs">✓ Secure Identity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 text-gray-500 text-sm text-center py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <p>
            &copy; {new Date().getFullYear()} thebiolink.lol — Your identity. Your consequences.
          </p>
          <div className="mt-2 space-x-6">
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
            <Link href="/security" className="hover:text-white transition">
              Security
            </Link>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}
