import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase'; // Your firebase init file
import { doc, setDoc } from 'firebase/firestore';
import crypto from 'crypto';

// Generate token and expiry (example: 1 hour expiry)
function generateLinkToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 3600 * 1000; // 1 hour in ms
  return { token, expiresAt };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const user = getAuth().currentUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { token, expiresAt } = generateLinkToken();

  try {
    const tokenDocRef = doc(db, 'discordTokens', user.uid);
    await setDoc(tokenDocRef, { token, expiresAt }, { merge: true });

    res.status(200).json({ token, expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}
