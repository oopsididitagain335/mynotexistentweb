// pages/dashboard/badges.tsx
import React from 'react';
import Layout from '@components/Layout';
import { useAuth } from '@contexts/AuthContext';

const Badges: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <Layout title={`Badges — @${userProfile?.username}`}>
      <div className="dashboard-container page-badges">
        <h1 className="dashboard-title">Your Badges</h1>
        {userProfile?.badges?.map((badge: string, i: number) => (
          <div key={i} className="badge-item card">
            <img
              src={`/api/badges/${userProfile.username}_week_1.svg`}
              alt={badge}
              className="badge-img"
            />
            <code className="text-xs mt-2">{`<img src="${process.env.NEXT_PUBLIC_APP_URL}/api/badges/${userProfile.username}_week_1.svg" />`}</code>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Badges;
