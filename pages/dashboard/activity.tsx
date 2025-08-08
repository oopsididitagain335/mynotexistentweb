// pages/dashboard/activity.tsx
import React from 'react';
import Layout from '@components/Layout';
import ActivityPost from '@components/ActivityPost';

const Activity: React.FC = () => {
  return (
    <Layout title="Activity — thebiolink.lol">
      <div className="dashboard-container page-activity">
        <h1 className="dashboard-title">Your Activity</h1>
        <ActivityPost
          name="John Doe"
          username="johndoe"
          avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
          content="Just launched my new AI art collection!"
          image="https://source.unsplash.com/random/600x400"
          timestamp="2h ago"
          likes={12}
        />
      </div>
    </Layout>
  );
};

export default Activity;
