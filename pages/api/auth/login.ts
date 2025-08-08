// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { isRateLimited } from '@lib/rate-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (isRateLimited(req)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return res.status(200).json({
      success: true,
      uid: user.uid,
      email: user.email,
      verified: user.emailVerified,
    });
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}
