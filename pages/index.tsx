import React, { useState } from 'react';
import Layout from '@components/Layout';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // For demo, simple submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // Proceed with signup logic
    alert(`Signing up:\nUsername: ${username}\nEmail: ${email}`);
  };

  return (
    <Layout title="thebiolink.lol — Your Identity. Your Consequences." noNav>
      <main className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
        <h1 className="font-extrabold text-4xl sm:text-5xl max-w-4xl text-center mb-10">
          <span className="text-purple-700 dark:text-purple-400">Your Link. Your Server. Your Identity.</span>
          <br />
          <span className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium">
            One profile. Zero compromises.
          </span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-lg"
        >
          {/* URL input with prefix */}
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300" htmlFor="username">
            Your URL
          </label>
          <div className="flex mb-6">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-500 select-none">
              thebiolink.lol/
            </span>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
              placeholder="username"
              required
              minLength={3}
              maxLength={30}
              className="flex-grow rounded-r-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Email input */}
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full mb-6 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />

          {/* Password input */}
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            minLength={6}
            className="w-full mb-6 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />

          {/* Confirm Password input */}
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            required
            minLength={6}
            className="w-full mb-6 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />

          <button
            type="submit"
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 rounded-lg font-semibold text-white transition"
          >
            Get Started
          </button>
        </form>

        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          Built for creators, hackers, and digital citizens.
        </div>
      </main>
    </Layout>
  );
};

export default Home;
