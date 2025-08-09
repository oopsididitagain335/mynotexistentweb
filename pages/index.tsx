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
    window.location.href = `/signup?username=${encodeURIComponent(username.trim())}`;
  };

  return (
    <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-gray-100 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight select-none">
            <span className="text-purple-400">thebiolink</span>
            <span className="text-gray-400">.lol</span>
          </div>

          <div className="space-x-8 text-gray-300 hidden md:flex">
            <Link href="#features" passHref>
              <a className="hover:text-purple-300 transition duration-200">Features</a>
            </Link>
            <Link href="#pricing" passHref>
              <a className="hover:text-purple-300 transition duration-200">Pricing</a>
            </Link>
            <Link href="#support" passHref>
              <a className="hover:text-purple-300 transition duration-200">Support</a>
            </Link>
            <Link href="/login" passHref>
              <a className="hover:text-purple-300 transition duration-200">Login</a>
            </Link>
          </div>

          <div className="hidden md:block">
            <Link href="/signup">
              <a className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-full font-medium transition duration-200 shadow-lg hover:shadow-purple-500/25">
                Get Started
              </a>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 px-6 py-16 text-center max-w-5xl mx-auto mt-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              Everything You Are
            </span>
            <br />
            One Link. One Identity.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            thebiolink.lol gives creators, developers, and digital citizens a fast, beautiful, and customizable bio link hub. 
            Own your identity — no algorithms, no noise.
          </p>

          {/* Username Claim */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-16 bg-gray-800/60 backdrop-blur-sm rounded-xl p-2 border border-gray-700 shadow-xl">
            <div className="flex items-center px-4 py-3 text-gray-400 font-mono text-sm sm:text-base rounded-lg bg-gray-700/50">
              thebiolink.lol/
            </div>
            <input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
              className="flex-1 px-4 py-3 bg-gray-700 rounded-lg text-gray-100 placeholder-gray-500 font-mono text-base focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <button
              onClick={handleClaim}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
            >
              Claim Now
            </button>
          </div>
        </section>

        {/* Preview Cards */}
        <section className="relative z-10 px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { title: "Clean & Fast", desc: "Minimalist design with lightning-fast load times.", img: "/previews/clean.png" },
              { title: "Fully Customizable", desc: "Themes, fonts, animations — make it yours.", img: "/previews/custom.png" },
              { title: "Analytics Included", desc: "Track clicks, sources, and engagement.", img: "/previews/analytics.png" },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group bg-gray-800/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 shadow-xl hover:shadow-2xl hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl"></div>
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="relative z-10 px-6 py-16 text-center border-t border-gray-800">
          <p className="text-gray-400 text-lg mb-6">
            Join thousands of creators building their digital identity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <a className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold shadow-lg hover:shadow-purple-500/30 transition">
                Start for Free
              </a>
            </Link>
            <Link href="#features">
              <a className="px-8 py-3 border border-gray-600 rounded-full font-medium hover:border-purple-500 hover:text-purple-300 transition">
                Explore Features
              </a>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-8 text-center text-gray-600 text-sm border-t border-gray-800">
          Built for creators, hackers, and digital citizens. © {new Date().getFullYear()} thebiolink.lol
        </footer>
      </main>
    </Layout>
  );
};

export default Index;
