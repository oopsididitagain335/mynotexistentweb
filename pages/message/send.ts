// pages/api/message/send.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { encryptMessage } from '@lib/crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { senderId, recipientId, message } = req.body;

  if (!senderId || !recipientId || !message) {
    return res.status(400).json({
      error: 'Missing required fields: senderId, recipientId, message',
    });
  }

  try {
    // Check recipient exists
    const recipientDoc = await getDoc(doc(db, 'users', recipientId));
    if (!recipientDoc.exists()) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const recipientData = recipientDoc.data();

    if (!recipientData?.publicKey) {
      return res.status(400).json({ error: 'Recipient has no public key' });
    }

    // Encrypt message
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
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
