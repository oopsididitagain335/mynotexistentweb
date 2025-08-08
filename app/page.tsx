'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/auth/signup?username=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-mybio-light">
      <h1 className="text-5xl font-bold text-mybio-primary mb-4">mybio</h1>
      <p className="text-lg text-gray-600 mb-8">Your link. Your identity.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-mybio-primary">
          <span className="bg-gray-100 px-4 py-3 border-r border-gray-300 text-gray-500">
            {window.location.host}/
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            className="flex-1 px-4 py-3 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-mybio-primary text-white py-3 rounded-lg font-medium hover:bg-mybio-hover transition"
        >
          Continue
        </button>
      </form>

      <p className="mt-8 text-sm text-gray-500">
        Already have an account?{' '}
        <a href="/auth/login" className="text-mybio-primary hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
