// pages/api/discord/verify-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    // Read the token document from Firestore
    const tokenDocRef = doc(db, 'linkTokens', token);
    const tokenDocSnap = await getDoc(tokenDocRef);

    if (!tokenDocSnap.exists()) {
      return res.status(404).json({ error: 'Token not found' });
    }

    const data = tokenDocSnap.data();

    // Check if expired
    const expiresAt = data.expiresAt?.toDate?.();
    if (!expiresAt || new Date() > expiresAt) {
      return res.status(410).json({ error: 'Token expired' });
    }

    // Check if already used
    if (data.used) {
      return res.status(403).json({ error: 'Token already used' });
    }

    // Return success with userId
    return res.status(200).json({
      valid: true,
      userId: data.userId,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
