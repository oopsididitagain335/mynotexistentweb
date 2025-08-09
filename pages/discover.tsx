import React from 'react';
import Layout from '@components/Layout';
import { useRouter } from 'next/router';

const Discover = () => {
  const router = useRouter();

  const users: Array<{ id: string; name: string; username: string; avatar: string; category: string }> = [];
  const loading = false;

  const setFilters = () => {};

  return (
    <Layout title="Discover — thebiolink.lol">
      <div className="page-discover">
        <h2 className="text-2xl font-bold mb-4">Discover</h2>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['Designer', 'Developer', 'Artist', 'AI'].map((cat) => (
              <button
                key={cat}
                onClick={setFilters}
                className="badge"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="discover-grid">
          {users.map((user) => (
            <div
              key={user.id}
              className="discover-card"
              onClick={() => router.push(`/${user.username}`)}
            >
              <img src={user.avatar} alt={user.name} className="avatar-lg mb-2" />
              <strong>{user.name}</strong>
              <span className="text-gray-500 dark:text-gray-400">@{user.username}</span>
              <span className="badge badge-accent mt-2">{user.category}</span>
            </div>
          ))}
        </div>
        {loading && <div className="loader mx-auto my-6"></div>}
      </div>
    </Layout>
  );
};

export default Discover;
