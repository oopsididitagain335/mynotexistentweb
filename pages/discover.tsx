import React from 'react';
import Layout from '@components/Layout';
import { useRouter } from 'next/router';

const Discover: React.FC = () => {
  const router = useRouter();

  // Mock data since context is missing
  const users = [
    { id: 1, name: 'Jane Doe', username: 'jane', avatar: '/avatar1.png', category: 'Designer' },
    { id: 2, name: 'John Smith', username: 'john', avatar: '/avatar2.png', category: 'Developer' },
    { id: 3, name: 'Alex Johnson', username: 'alex', avatar: '/avatar3.png', category: 'Artist' },
  ];
  const loading = false;

  const setFilters = () => {
    // Placeholder for future filter logic
  };

  return (
    <Layout title="Discover — thebiolink.lol">
      <div className="page-discover">
        <h2 className="text-2xl font-bold mb-4">Discover</h2>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['Designer', 'Developer', 'Artist', 'AI'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilters()}
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
