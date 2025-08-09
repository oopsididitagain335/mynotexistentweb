// pages/api/discord/generate-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Generate a 32-character hex token
function generateLinkToken() {
  // Use Node.js crypto if available (during runtime)
  if (typeof crypto !== 'undefined' && crypto?.randomBytes) {
    const token = crypto.randomBytes(16).toString('hex'); // 32 chars
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    return { token, expiresAt };
  }

  // Fallback (not secure, for dev only)
  console.warn('Crypto not available - using insecure fallback');
  const token = Array(32).fill(0).map(() => Math.random().toString(36)[2]).join('');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  return { token, expiresAt };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const auth = getAuth();
  const user = auth.currentUser;

  // This is a simplified version — in practice, you'd verify auth via session or token
  // For now, assume user is logged in via client
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { token, expiresAt } = generateLinkToken();

    const tokenDocRef = doc(db, 'linkTokens', token);
    await setDoc(tokenDocRef, {
      userId: user.uid,
      expiresAt,
      used: false,
    });

    return res.status(200).json({ token, expiresAt: expiresAt.toISOString() });
  } catch (error: any) {
    console.error('Generate token error:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
}
