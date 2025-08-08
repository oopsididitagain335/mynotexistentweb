// pages/search.tsx
import React from 'react';
import Layout from '@components/Layout';
import SearchBar from '@components/SearchBar';
import { useDiscovery } from '@contexts/DiscoveryContext';
import { useRouter } from 'next/router';

const Search: React.FC = () => {
  const { search } = useDiscovery();
  const router = useRouter();

  return (
    <Layout title="Search — thebiolink.lol">
      <div className="page-search">
        <h2 className="text-2xl font-bold mb-4">Search Users</h2>
        <SearchBar onSearch={search} />
        {/* Results handled by DiscoveryContext */}
      </div>
    </Layout>
  );
};

export default Search;
