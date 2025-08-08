'use client';

import { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { get } from 'firebase/database';
import { db, ref } from '@/lib/firebase';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Mock data for demo
      setData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Clicks',
            data: [12, 19, 15, 22, 18, 25, 30],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            tension: 0.4,
          },
        ],
      });
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>
      {data ? <Chart type="line" data={data} /> : <p>Loading...</p>}
    </div>
  );
}
