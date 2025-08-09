// pages/api/message/inbox.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { db } from '@lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('recipientId', '==', userId), orderBy('timestamp', 'desc'));

    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Inbox fetch error:', error);
    return res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
}
