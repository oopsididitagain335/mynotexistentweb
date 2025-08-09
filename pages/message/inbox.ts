// pages/api/message/inbox.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import admin from 'firebase-admin';

// Firebase config (replace with your own)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ...
};

// Initialize Firebase App once
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

// This function won't work server-side: getAuth().currentUser is client-only.
// Instead, you must verify the user token sent from the client:

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token' });
  }
  const idToken = authHeader.split('Bearer ')[1];

  // Firebase Admin SDK is needed to verify tokens server-side.
  if (!admin.apps.length) {
    // Initialize admin app with your service account credentials
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
    });
  }

  try {
    // Verify the user token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('recipientId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(messages);
  } catch (error: any) {
    return res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
}
