// pages/api/links/save.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getAuth().currentUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { links } = req.body;
  if (!Array.isArray(links)) {
    return res.status(400).json({ error: 'Links must be an array' });
  }

  try {
    await updateDoc(doc(db, 'users', user.uid), { links });
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
