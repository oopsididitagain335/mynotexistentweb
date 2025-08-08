'use client';

import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-mybio-dark mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/links" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Manage Links</h2>
            <p className="text-gray-600">Add, edit, and reorder your bio links.</p>
          </Link>

          <Link href="/dashboard/profile" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p className="text-gray-600">Edit your name, bio, and photo.</p>
          </Link>

          <Link href="/dashboard/domain" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Custom Domain</h2>
            <p className="text-gray-600">Connect your own domain (e.g., bio.yoursite.com).</p>
          </Link>

          <Link href="/dashboard/analytics" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-gray-600">Track clicks and engagement over time.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
