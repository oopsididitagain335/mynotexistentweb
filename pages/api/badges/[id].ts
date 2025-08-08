// pages/api/badges/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';

const BADGE_TYPES: Record<string, string> = {
  clicks: '🔥 {clicks}+ Clicks This Week',
  growth: '🚀 {growth}% Growth',
  messages: '💬 {messages} Messages Received',
  followers: '👥 {followers} New Followers',
  countries: '🌐 {countries} Countries',
  trending: '🏆 Trending This Week',
  verified: '🛡️ Verified (Discord Linked)',
  unbanned: '🔓 Unbanned',
  first: '🎉 First Link',
  nightowl: '🌙 Night Owl',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).send('Invalid badge ID');

  const match = id.match(/^([^_]+)_week_(\d+)$/);
  if (!match) return res.status(400).send('Invalid badge format');

  const username = match[1];
  const week = parseInt(match[2], 10);

  // In prod: fetch user data from Firestore
  // For now: mock
  const data = {
    clicks: 1250,
    growth: 42,
    messages: 88,
    followers: 23,
    countries: 17,
  };

  const badgeText = BADGE_TYPES.clicks.replace('{clicks}', data.clicks.toString());

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="60" viewBox="0 0 300 60" fill="none">
      <rect width="300" height="60" fill="#7C3AED"/>
      <text x="150" y="38" font-family="Inter, sans-serif" font-size="16" fill="white" text-anchor="middle">
        ${badgeText}
      </text>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500');
      </style>
    </svg>
  `.trim();

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'max-age=3600');
  res.send(svg);
}
