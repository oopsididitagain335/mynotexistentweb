// pages/search.tsx
import React from 'react';
import Layout from '@components/Layout';
import SearchBar from '@components/SearchBar';
import { useDiscovery } from '@contexts/DiscoveryContext';
import { useRouter } from 'next/router';

// ✅ Now this is valid because `DiscoveryContextType` includes these
const Search: React.FC = () => {
  const { search, users, loading } = useDiscovery(); // ✅ All exist now
  const router = useRouter();

  return (
    <Layout title="Search — thebiolink.lol">
      <div className="page-search">
        <h2 className="text-2xl font-bold mb-4">Search Users</h2>
        <SearchBar onSearch={search} />

        {loading && <div className="loader my-6">Searching...</div>}

        <div className="discover-grid mt-6">
          {users.length === 0 && !loading ? (
            <p className="text-gray-500 dark:text-gray-400">No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="discover-card"
                onClick={() => router.push(`/${user.username}`)}
              >
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.name || 'User'}
                  className="avatar-lg mb-2"
                />
                <strong>{user.name || 'Anonymous'}</strong>
                <span className="text-gray-500 dark:text-gray-400">@{user.username}</span>
                {user.category && <span className="badge badge-accent mt-2">{user.category}</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
