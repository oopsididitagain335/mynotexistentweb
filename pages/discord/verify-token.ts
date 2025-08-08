// pages/api/discord/verify-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { isValidToken } from '@lib/tokens';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    const tokenDoc = await getDoc(doc(db, 'linkTokens', token));
    if (!tokenDoc.exists() || tokenDoc.data().used) {
      return res.status(404).json({ error: 'Invalid or used token' });
    }

    const data = tokenDoc.data();
    if (!isValidToken(data.expiresAt.toDate())) {
      return res.status(410).json({ error: 'Token expired' });
    }

    return res.status(200).json({ valid: true, userId: data.userId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
