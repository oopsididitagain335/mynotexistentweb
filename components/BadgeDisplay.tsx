// components/BadgeDisplay.tsx
import React from 'react';

interface BadgeDisplayProps {
  username: string;
  week?: number;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ username, week = new Date().getWeek() }) => {
  const src = `${process.env.NEXT_PUBLIC_APP_URL}/api/badges/${username}_week_${week}.svg`;
  return (
    <div className="badge-svg-container">
      <img src={src} alt="Weekly Badge" className="badge-svg" />
    </div>
  );
};

// Extend Date prototype
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function () {
  const date = new Date(this);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

export default BadgeDisplay;
