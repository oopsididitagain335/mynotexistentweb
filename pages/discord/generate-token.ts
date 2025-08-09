// pages/api/discord/generate-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

// ✅ Safely import Node.js crypto
function getCrypto() {
  return require('crypto') as typeof import('crypto');
}

function generateLinkToken() {
  const crypto = getCrypto();
  const token = crypto.randomBytes(16).toString('hex'); // 32 chars
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  return { token, expiresAt };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const auth = getAuth();
  const user = auth.currentUser;

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
