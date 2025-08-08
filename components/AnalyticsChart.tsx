// components/AnalyticsChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  clicks: number;
}

interface AnalyticsChartProps {
  data: DataPoint[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip />
        <Line type="monotone" dataKey="clicks" stroke="#7C3AED" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;
