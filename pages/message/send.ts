// pages/api/message/send.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { encryptMessage } from '@lib/crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sender = getAuth().currentUser;
  if (!sender) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipientId, message } = req.body;
  if (!recipientId || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const recipientDoc = await getDoc(doc(db, 'users', recipientId));
    if (!recipientDoc.exists()) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const recipientData = recipientDoc.data();
    const encrypted = encryptMessage(message, recipientData.publicKey);

    await addDoc(collection(db, 'messages'), {
      senderId: sender.uid,
      recipientId,
      ciphertext: encrypted.ciphertext,
      ephemeralPublicKey: encrypted.ephemeralPublicKey,
      nonce: encrypted.nonce,
      timestamp: new Date(),
      read: false,
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
