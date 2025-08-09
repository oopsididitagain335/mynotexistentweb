// pages/api/message/send.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { encryptMessage } from '@lib/crypto';

// Initialize Firebase Admin if not initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') 
    return res.status(405).json({ error: 'Method not allowed' });

  // Extract and verify Firebase ID token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) 
    return res.status(401).json({ error: 'Unauthorized: No token provided' });

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const senderId = decodedToken.uid;

    const { recipientId, message } = req.body;
    if (!recipientId || !message) 
      return res.status(400).json({ error: 'Missing recipientId or message' });

    const recipientDoc = await getDoc(doc(db, 'users', recipientId));
    if (!recipientDoc.exists()) 
      return res.status(404).json({ error: 'Recipient not found' });

    const recipientData = recipientDoc.data();
    if (!recipientData?.publicKey) 
      return res.status(400).json({ error: 'Recipient public key not found' });

    // Encrypt message with recipient's public key
    const encrypted = encryptMessage(message, recipientData.publicKey);

    // Save encrypted message to Firestore
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
  } catch (err: any) {
    console.error('Error sending message:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
