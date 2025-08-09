// pages/api/token/send.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { doc, getDoc, deleteDoc, getFirestore } from 'firebase/firestore';

// Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized: No token' });

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });

    const tokenDocRef = doc(db, 'discordTokens', userId);
    const tokenDoc = await getDoc(tokenDocRef);

    if (!tokenDoc.exists())
      return res.status(404).json({ error: 'Token not found' });

    const { token: storedToken, expiresAt } = tokenDoc.data() as {
      token: string;
      expiresAt: number;
    };

    if (storedToken !== token)
      return res.status(403).json({ error: 'Invalid token' });

    if (Date.now() > expiresAt) {
      await deleteDoc(tokenDocRef);
      return res.status(403).json({ error: 'Token expired' });
    }

    // Token verified: Proceed with your logic here

    // Optional: delete token after use to prevent reuse
    await deleteDoc(tokenDocRef);

    return res.status(200).json({ success: true, message: 'Token verified' });
  } catch (err: any) {
    console.error('Verification error:', err);
    return res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
}
