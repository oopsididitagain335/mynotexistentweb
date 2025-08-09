// pages/search.tsx
import React from 'react';
import Layout from '@components/Layout';
import SearchBar from '@components/SearchBar';
import { useDiscovery } from '@contexts/DiscoveryContext';
import { useRouter } from 'next/router';
import { PublicUser } from '@contexts/DiscoveryContext';

const Search: React.FC = () => {
  const { search, results, loading, error } = useDiscovery();
  const router = useRouter();

  return (
    <Layout title="Search Users — thebiolink.lol">
      <div className="page-search max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Search Users</h2>

        <SearchBar onSearch={search} placeholder="Search by name, username, or category..." />

        {loading && (
          <div className="loader my-6 text-center text-gray-500 dark:text-gray-400">
            Searching...
          </div>
        )}

        {error && !loading && (
          <div className="error my-6 p-4 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && results.length === 0 && !error && (
          <p className="text-gray-500 dark:text-gray-400 mt-6">
            {results.length === 0 ? 'No users found.' : ''}
          </p>
        )}

        <div className="discover-grid mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((user) => (
            <div
              key={user.id}
              className="discover-card p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800"
              onClick={() => router.push(`/${user.username}`)}
            >
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.name || user.username || 'User'}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
              />
              <strong className="block text-center font-semibold text-gray-900 dark:text-gray-100">
                {user.name || 'Anonymous'}
              </strong>
              <span className="block text-center text-gray-500 dark:text-gray-400 text-sm">
                @{user.username}
              </span>
              {user.category && (
                <span className="block text-center mt-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
                  {user.category}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;                <span className="text-gray-500 dark:text-gray-400">@{user.username}</span>
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
