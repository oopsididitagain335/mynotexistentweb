// pages/api/message/inbox.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getAuth().currentUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const q = query(
      collection(db, 'messages'),
      where('recipientId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(messages);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
