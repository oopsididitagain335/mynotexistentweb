// pages/search.tsx
import React from 'react';
import Layout from '@components/Layout';
import SearchBar from '@components/SearchBar';
import { useDiscovery } from '@contexts/DiscoveryContext';
import { useRouter } from 'next/router';

const Search: React.FC = () => {
  const { search, users, loading } = useDiscovery();
  const router = useRouter();

  return (
    <Layout title="Search — thebiolink.lol">
      <div className="page-search">
        <h2 className="text-2xl font-bold mb-4">Search Users</h2>
        <SearchBar onSearch={search} />
        
        {loading && <div className="loader my-6"></div>}
        
        <div className="discover-grid mt-6">
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
      </div>
    </Layout>
  );
};

export default Search;
