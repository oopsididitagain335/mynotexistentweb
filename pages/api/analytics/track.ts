// pages/api/analytics/track.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { addDays, format } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'User ID required' });

  const date = format(new Date(), 'yyyy-MM-dd');
  const ref = doc(db, `analytics/${uid}/daily`, date);

  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { clicks: increment(1) });
    } else {
      await setDoc(ref, { date, clicks: 1 });
    }

    // Also update user's weeklyClicks
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { weeklyClicks: increment(1) });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
