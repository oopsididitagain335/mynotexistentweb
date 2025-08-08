// pages/api/auth/verify-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!auth.currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await sendEmailVerification(auth.currentUser);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
