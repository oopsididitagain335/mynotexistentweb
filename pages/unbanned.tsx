// pages/unbanned.tsx
import React from 'react';
import UnbannedPage from '@components/UnbannedPage';
import Layout from '@components/Layout';

const Unbanned: React.FC = () => {
  return (
    <Layout title="Unbanned — thebiolink.lol" noNav>
      <UnbannedPage />
    </Layout>
  );
};

export default Unbanned;
