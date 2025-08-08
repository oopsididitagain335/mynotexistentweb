// pages/api/discord/generate-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { generateLinkToken } from '@lib/tokens';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getAuth().currentUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { token, expiresAt } = generateLinkToken();

  try {
    await setDoc(doc(db, 'linkTokens', token), {
      userId: user.uid,
      expiresAt,
      used: false,
    });

    return res.status(200).json({ token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
