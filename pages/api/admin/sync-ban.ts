// pages/api/admin/sync-ban.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { syncBanToWeb } from '@lib/ban-sync';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { discordId } = req.body;
  if (!discordId) {
    return res.status(400).json({ error: 'Discord ID required' });
  }

  try {
    await syncBanToWeb(discordId);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
