// pages/search.tsx
import React, { useState } from 'react';
import Layout from '@components/Layout';
import SearchBar from '@components/SearchBar';
import { useDiscovery } from '@contexts/DiscoveryContext';
import { useRouter } from 'next/router';

// 🔽 Define the shape of a public user (adjust based on your actual data)
interface PublicUser {
  id: string;
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  category?: string;
  badges?: string[];
  followersCount?: number;
  weeklyClicks?: number;
}

const Search: React.FC = () => {
  const { search, loading: contextLoading } = useDiscovery();
  const router = useRouter();

  // 🔁 Local state to hold search results
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Enhanced search handler that updates local state
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await search(query); // Assume `search` returns Promise<PublicUser[]>
      setUsers(results || []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Search — thebiolink.lol">
      <div className="page-search">
        <h2 className="text-2xl font-bold mb-4">Search Users</h2>
        <SearchBar onSearch={handleSearch} />

        {(loading || contextLoading) && <div className="loader my-6">Loading...</div>}

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
                  alt={user.name || user.username || 'User'}
                  className="avatar-lg mb-2"
                />
                <strong>{user.name || 'Anonymous'}</strong>
                <span className="text-gray-500 dark:text-gray-400">
                  @{user.username}
                </span>
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
