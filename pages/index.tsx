import React, { useState } from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';

const Index: React.FC = () => {
  const [username, setUsername] = useState('');

  const handleClaim = () => {
    if (!username.trim()) {
      alert('Please enter a username.');
      return;
    }
    // Redirect to signup page with username pre-filled (optional)
    window.location.href = `/signup?username=${encodeURIComponent(username.trim())}`;
  };

  return (
    <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-gray-100 px-6 py-16 flex flex-col items-center">
        {/* Navbar */}
        <nav className="w-full max-w-7xl flex justify-between items-center mb-20">
          <div className="text-2xl font-extrabold tracking-tight select-none cursor-default">
            <span className="text-purple-400">thebiolink</span><span className="text-gray-400">.lol</span>
          </div>
          <div className="space-x-8 text-gray-300 hidden md:flex">
            <a href="#" className="hover:text-purple-400 transition">Help Center</a>
            <a href="#" className="hover:text-purple-400 transition">Discord</a>
            <a href="#" className="hover:text-purple-400 transition">Pricing</a>
            <Link href="/login">
              <a className="hover:text-purple-400 transition">Login</a>
            </Link>
          </div>
          <div className="md:block hidden">
            <Link href="/signup">
              <a className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full font-semibold transition">
                Sign Up Free
              </a>
            </Link>
          </div>
        </nav>

        {/* Headline */}
        <section className="max-w-4xl text-center mb-14 px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="text-purple-400">Everything you want,</span> <br />
            right here at your biolink.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            thebiolink.lol is your all-in-one platform for customizable, fast, and secure bio links.
            Take control of your identity — simple, elegant, and built for creators.
          </p>
        </section>

        {/* Username Input Bar */}
        <section className="flex flex-col sm:flex-row items-center gap-4 max-w-md w-full mb-20">
          <div className="flex items-center bg-gray-800 rounded-l-md px-4 py-3 text-gray-400 font-mono select-none text-lg sm:text-xl">
            thebiolink.lol/
          </div>
          <input
            type="text"
            aria-label="username"
            placeholder="yourusername"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
            className="flex-grow rounded-r-md px-4 py-3 bg-gray-700 text-gray-100 placeholder-gray-500 font-mono text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button
            onClick={handleClaim}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Claim Now
          </button>
        </section>

        {/* Preview Cards */}
        <section className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
          {[
            '/mnt/data/0001a2b8-83b0-4a54-8793-c0c715ea4143.png',
            '/mnt/data/0001a2b8-83b0-4a54-8793-c0c715ea4143.png',
            '/mnt/data/0001a2b8-83b0-4a54-8793-c0c715ea4143.png',
          ].map((src, idx) => (
            <div
              key={idx}
              className="rounded-xl shadow-lg overflow-hidden border border-purple-700 transform hover:scale-105 transition"
              style={{ perspective: '800px' }}
            >
              <img
                src={src}
                alt={`Preview ${idx + 1}`}
                className="w-full h-auto object-cover"
                style={{
                  borderRadius: '1rem',
                  boxShadow: '0 12px 25px rgb(107 33 168 / 0.4)',
                }}
              />
            </div>
          ))}
        </section>

        {/* Footer Text */}
        <footer className="mt-24 text-gray-500 text-sm text-center max-w-2xl">
          Built for creators, hackers, and digital citizens.
        </footer>
      </main>
    </Layout>
  );
};

export default Index;
