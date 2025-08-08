// pages/banned.tsx
import React from 'react';
import BannedPage from '@components/BannedPage';
import Layout from '@components/Layout';

const Banned: React.FC = () => {
  return (
    <Layout title="Banned — thebiolink.lol" noNav>
      <BannedPage />
    </Layout>
  );
};

export default Banned;
