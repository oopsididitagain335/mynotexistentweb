// pages/dashboard/domain.tsx
import React from 'react';
import Layout from '@components/Layout';
import DomainManager from '@components/DomainManager';

const Domain: React.FC = () => {
  return (
    <Layout title="Custom Domain — thebiolink.lol">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Custom Domain</h1>
        <DomainManager />
      </div>
    </Layout>
  );
};

export default Domain;
