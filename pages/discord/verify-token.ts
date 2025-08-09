import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const user = getAuth().currentUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });

  try {
    const tokenDocRef = doc(db, 'discordTokens', user.uid);
    const tokenDoc = await getDoc(tokenDocRef);

    if (!tokenDoc.exists()) return res.status(404).json({ error: 'Token not found' });

    const { token: storedToken, expiresAt } = tokenDoc.data();

    if (storedToken !== token) return res.status(403).json({ error: 'Invalid token' });
    if (Date.now() > expiresAt) {
      await deleteDoc(tokenDocRef);
      return res.status(403).json({ error: 'Token expired' });
    }

    // Verified - you can proceed with your logic here

    // Optionally delete token after verification to prevent reuse
    await deleteDoc(tokenDocRef);

    res.status(200).json({ success: true, message: 'Token verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify token' });
  }
}
