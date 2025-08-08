// pages/dashboard/analytics.tsx
import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import AnalyticsChart from '@components/AnalyticsChart';
import { useAuth } from '@contexts/AuthContext';

const Analytics: React.FC = () => {
  const { userProfile } = useAuth();
  const [data, setData] = useState<{ date: string; clicks: number }[]>([]);

  useEffect(() => {
    // Simulate real-time data
    const interval = setInterval(() => {
      const now = new Date().toLocaleDateString();
      setData(prev => {
        const d = [...prev];
        const today = d.find(x => x.date === now);
        if (today) {
          today.clicks += Math.floor(Math.random() * 3);
        } else {
          d.push({ date: now, clicks: Math.floor(Math.random() * 10) });
        }
        return d.slice(-7);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout title={`Analytics — @${userProfile?.username}`}>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Analytics</h1>
        <div className="card">
          <AnalyticsChart data={data.length ? data : [
            { date: 'Mon', clicks: 12 },
            { date: 'Tue', clicks: 18 },
            { date: 'Wed', clicks: 24 },
            { date: 'Thu', clicks: 15 },
            { date: 'Fri', clicks: 30 },
            { date: 'Sat', clicks: 22 },
            { date: 'Sun', clicks: 19 },
          ]} />
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
