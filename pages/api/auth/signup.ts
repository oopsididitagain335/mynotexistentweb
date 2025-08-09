// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@lib/firebase';
import { doc, setDoc } from 'firebase/firestore'; // ✅ Added setDoc
import { generateKeyPair } from '@lib/crypto';
import { sendEmail } from '@lib/email';
import { isRateLimited } from '@lib/rate-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (isRateLimited(req)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const keypair = generateKeyPair();

    // ✅ Now works — setDoc is imported
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      username,
      name: username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: '',
      category: 'Creator',
      privacy: 'public',
      template: 'minimal',
      darkMode: false,
      banned: false,
      linked: false,
      followersCount: 0,
      followingCount: 0,
      weeklyClicks: 0,
      badges: ['🎉 First Link'],
      publicKey: keypair.publicKey,
      privateKeyEncrypted: null,
      links: [],
      createdAt: new Date(),
    });

    await sendEmail({
      to: email,
      subject: 'Welcome to thebiolink.lol',
      html: `<p>Thanks for signing up, ${username}!</p>
             <p>Verify your email <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify">here</a>.</p>`,
    });

    return res.status(200).json({ success: true, uid: user.uid });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
