// pages/dashboard/index.tsx
import React from 'react';
import Layout from '@components/Layout';
import { useAuth } from '@contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  return (
    <Layout title={`Dashboard — @${userProfile.username}`}>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Edit Profile</h1>
        {/* Full editor will go here */}
        <div className="card">
          <p>Profile editor coming soon.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
