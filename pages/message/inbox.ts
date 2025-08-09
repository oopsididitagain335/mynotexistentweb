// pages/api/message/inbox.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('recipientId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(messages);
  } catch (error: any) {
    console.error('Inbox fetch error:', error);
    return res.status(500).json({ error: 'Failed to load messages' });
  }
}
