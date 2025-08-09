import React, { useState } from 'react';
import Layout from '@components/Layout';
import SearchBar from '@components/SearchBar';
import { useDiscovery } from '../contexts/DiscoveryContext';  // <-- make sure path is correct relative to file
import { useRouter } from 'next/router';

const Search: React.FC = () => {
  const { search, results } = useDiscovery();
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (term: string) => {
    setQuery(term);
    search(term);
  };

  return (
    <Layout title="Search — thebiolink.lol">
      <div className="page-search">
        <h2 className="text-2xl font-bold mb-4">Search Users</h2>
        <SearchBar onSearch={handleSearch} />
        <ul>
          {results.map((res) => (
            <li key={res.id}>{res.name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Search;
