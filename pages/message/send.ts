// pages/api/message/send.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { db } from '@lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { encryptMessage } from '@lib/crypto';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const senderId = decodedToken.uid;

    const { recipientId, message } = req.body;
    if (!recipientId || !message) {
      return res.status(400).json({ error: 'Missing fields: recipientId and message are required' });
    }

    const recipientDoc = await getDoc(doc(db, 'users', recipientId));
    if (!recipientDoc.exists()) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const recipientData = recipientDoc.data();

    // Encrypt message with recipient's public key
    const encrypted = encryptMessage(message, recipientData.publicKey);

    await addDoc(collection(db, 'messages'), {
      senderId,
      recipientId,
      ciphertext: encrypted.ciphertext,
      ephemeralPublicKey: encrypted.ephemeralPublicKey,
      nonce: encrypted.nonce,
      timestamp: new Date(),
      read: false,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Send message error:', error);
    return res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
}
