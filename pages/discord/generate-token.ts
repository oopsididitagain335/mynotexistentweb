// pages/api/discordTokens/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { db } from '@lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import crypto from 'crypto';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}

function generateLinkToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 3600 * 1000; // 1 hour expiry
  return { token, expiresAt };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { token, expiresAt } = generateLinkToken();

    const tokenDocRef = doc(db, 'discordTokens', userId);
    await setDoc(tokenDocRef, { token, expiresAt }, { merge: true });

    return res.status(200).json({ token, expiresAt });
  } catch (error) {
    console.error('Generate token error:', error);
    return res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
}
