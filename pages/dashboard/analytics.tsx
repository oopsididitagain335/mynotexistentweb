// pages/dashboard/analytics.tsx
import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import AnalyticsChart from '@components/AnalyticsChart';
import { useAuth } from '@contexts/AuthContext';
import { db } from '@lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

interface ClickData {
  date: string;
  clicks: number;
}

const Analytics: React.FC = () => {
  const { userProfile } = useAuth();
  const [data, setData] = useState<ClickData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile?.uid) return;

    const ref = collection(db, `analytics/${userProfile.uid}/daily`);
    const q = query(ref, orderBy('date', 'desc'), limit(7));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dailyData: ClickData[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          dailyData.push({
            date: data.date,
            clicks: data.clicks || 0,
          });
        });
        // Reverse to show oldest → newest for chart
        setData(dailyData.reverse());
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load analytics:', err);
        setError('Could not load analytics.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userProfile?.uid]);

  // Fallback static data (only for first-time users with no data)
  const fallbackData: ClickData[] = [
    { date: 'Mon', clicks:  },
    { date: 'Tue', clicks:  },
    { date: 'Wed', clicks:  },
    { date: 'Thu', clicks:  },
    { date: 'Fri', clicks:  },
    { date: 'Sat', clicks:  },
    { date: 'Sun', clicks:  },
  ];

  // Format date (e.g., "2024-06-05" → "Wed")
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  const displayData = data.length
    ? data.map((d) => ({ ...d, date: formatDateLabel(d.date) }))
    : fallbackData;

  return (
    <Layout title={`Analytics — @${userProfile?.username}`}>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Analytics</h1>
        {error && <div className="text-danger mb-4">{error}</div>}
        {loading ? (
          <div className="card flex justify-center py-10">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="card">
            <AnalyticsChart data={displayData} />
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Clicks over the last 7 days
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
