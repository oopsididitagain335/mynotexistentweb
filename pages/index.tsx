// pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// 🔥 Import Firebase using relative path to avoid @/ alias issues
import { db, auth } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const router = useRouter();

  // Validate username format
  const isValid = /^[a-zA-Z0-9_-]{3,20}$/.test(username.trim());

  // Check availability in Firestore
  useEffect(() => {
    if (username.length >= 3 && isValid) {
      setIsChecking(true);
      const timeout = setTimeout(async () => {
        try {
          const userDocRef = doc(db, 'usernames', username);
          const snap = await getDoc(userDocRef);
          setIsAvailable(!snap.exists());
        } catch (error) {
          console.error('Check failed:', error);
          setIsAvailable(false);
        } finally {
          setIsChecking(false);
        }
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      setIsAvailable(null);
      setIsChecking(false);
    }
  }, [username, isValid]);

  // Track mouse for glow effect
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting || isAvailable === false) return;

    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'usernames', username);
      const snap = await getDoc(userDocRef);

      if (snap.exists()) {
        throw new Error('Username already taken');
      }

      await setDoc(userDocRef, {
        username,
        claimedAt: new Date().toISOString(),
        uid: auth.currentUser?.uid || null,
      });

      // Success
      setShowToast('success');
      setMessage(`✅ Successfully claimed thebiolink.lol/${username}`);
      setTimeout(() => {
        router.push(`/${username}`);
      }, 1500);
    } catch (error: any) {
      setShowToast('error');
      setMessage(`❌ ${error.message || 'Failed to claim username'}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-purple-950 z-0" />

      {/* Cursor Glow */}
      <div
        className="pointer-events-none fixed w-96 h-96 rounded-full blur-3xl opacity-10 z-0 transition duration-300"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(147, 51, 234, 0.25), transparent 40%)',
        }}
        onMouseMove={(e) => {
          const { clientX, clientY } = e;
          (e.currentTarget.style as any).setProperty('--x', `${clientX}px`);
          (e.currentTarget.style as any).setProperty('--y', `${clientY}px`);
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute rounded-full blur-3xl opacity-10 animate-pulse"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, #7c3aed, transparent)',
            top: '15%',
            right: '10%',
            animationDuration: '10s',
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-10 animate-pulse"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, #06b6d4, transparent)',
            bottom: '20%',
            left: '15%',
            animationDuration: '12s',
            animationDelay: '3s',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-black">the</span>
          <span className="text-2xl font-black bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            biolink
          </span>
          <span className="text-2xl text-gray-500">.lol</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/help">
            <a className="text-gray-300 hover:text-white transition">Help</a>
          </Link>
          <a href="https://discord.gg" target="_blank" className="text-gray-300 hover:text-white transition">
            Discord
          </Link>
          <Link href="/pricing">
            <a className="text-gray-300 hover:text-white transition">Pricing</a>
          </Link>
          <Link href="/login">
            <a className="text-green-400 hover:underline transition">Log In</a>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 py-16 flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black bg-gradient-to-b from-white via-green-200 to-teal-200 bg-clip-text text-transparent leading-tight mb-6">
          One link.
          <br />
          <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            Infinite possibilities.
          </span>
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
          Share your bio, files, socials, and more — all from one encrypted, secure link.
        </p>

        {/* Claim Username Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md mb-10">
          <div className="flex flex-col sm:flex-row gap-3 relative">
            <div className="flex-1 flex items-center bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-3 font-mono text-sm">
              <span className="text-green-400 truncate">thebiolink.lol/</span>
            </div>
            <div className="flex-2 relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                aria-label="Choose your username"
                className={`w-full bg-gray-900/60 backdrop-blur-sm border px-4 py-3 rounded-full font-mono text-white placeholder-gray-500 focus:outline-none transition-all pr-10 ${
                  !isValid && username
                    ? 'border-red-600'
                    : isAvailable === false
                    ? 'border-red-500'
                    : isAvailable === true
                    ? 'border-green-500'
                    : 'border-gray-700 focus:border-purple-500'
                }`}
              />
              {isChecking && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!isValid || isSubmitting || isAvailable === false}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-800 disabled:to-gray-900 text-white font-bold py-3 px-6 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 disabled:cursor-not-allowed min-w-32 text-sm"
            >
              {isSubmitting ? '...' : 'Claim'}
            </button>
          </div>

          {/* Feedback */}
          {username && !isValid && (
            <p className="text-red-500 text-xs mt-2 ml-4 text-left">
              Use 3–20 characters: letters, numbers, _, or -
            </p>
          )}
          {isAvailable === false && !isChecking && username && (
            <p className="text-red-500 text-xs mt-2 ml-4 text-left">Username taken.</p>
          )}
          {isAvailable === true && !isChecking && (
            <p className="text-green-500 text-xs mt-2 ml-4 text-left">✓ Available!</p>
          )}
        </form>

        {/* Toast Notification */}
        {showToast && (
          <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium animate-fade-in-up ${showToast === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {message}
          </div>
        )}

        {/* Mobile Login Link */}
        <p className="text-sm text-gray-500 mt-4 md:hidden">
          Already have an account?{' '}
          <Link href="/login">
            <a className="text-green-400 hover:underline">Log in</a>
          </Link>
        </p>
      </main>

      {/* Device Mockups */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 flex justify-center">
        <div className="relative w-full max-w-3xl aspect-video">
          {/* Laptop */}
          <div className="absolute top-0 left-1/3 transform -translate-x-1/2 animate-float" style={{ animationDelay: '0s' }}>
            <div className="w-72 h-48 bg-slate-900 border border-gray-700 rounded-t-xl rounded-b-sm shadow-2xl overflow-hidden">
              <div className="h-6 bg-gray-800 flex items-center px-2 space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="p-4 text-xs text-gray-300 font-mono">
                <div>🔗 thebiolink.lol/{username || 'yourname'}</div>
                <div className="mt-2">Bio • Files • Socials</div>
                <div className="mt-1 text-green-400">✓ Encrypted • Yours</div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="absolute top-16 right-1/3 transform translate-x-1/2 animate-float" style={{ animationDelay: '1.5s' }}>
            <div className="w-36 h-64 bg-black border border-gray-700 rounded-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"></div>
              <div className="p-3 text-xs text-gray-300 font-mono h-full flex flex-col">
                <div className="flex justify-between mb-2">
                  <span>12:34</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-gray-500"></div>
                    <div className="w-1 h-3 bg-gray-500"></div>
                    <div className="w-1 h-3 bg-gray-500"></div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full"></div>
                  <div className="text-white font-bold text-sm">{username || 'yourname'}</div>
                  <div className="text-gray-400 text-xs">+5 links</div>
                  <div className="text-green-400 text-xs">✓ Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 text-gray-500 text-sm text-center py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <p>&copy; {new Date().getFullYear()} thebiolink.lol — Own your identity.</p>
          <div className="mt-2 space-x-6">
            <Link href="/terms">
              <a className="hover:text-white transition">Terms</a>
            </Link>
            <Link href="/privacy">
              <a className="hover:text-white transition">Privacy</a>
            </Link>
            <Link href="/security">
              <a className="hover:text-white transition">Security</a>
            </Link>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, -15px);
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
