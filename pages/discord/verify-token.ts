// pages/api/discordTokens/verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { db } from '@lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
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

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const tokenDocRef = doc(db, 'discordTokens', userId);
    const tokenDoc = await getDoc(tokenDocRef);

    if (!tokenDoc.exists()) {
      return res.status(404).json({ error: 'Token not found' });
    }

    const data = tokenDoc.data();
    if (data.token !== token) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    if (Date.now() > data.expiresAt) {
      await deleteDoc(tokenDocRef);
      return res.status(403).json({ error: 'Token expired' });
    }

    // Optionally delete token after successful verification
    await deleteDoc(tokenDocRef);

    return res.status(200).json({ success: true, message: 'Token verified' });
  } catch (error) {
    console.error('Verify token error:', error);
    return res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
}
