// pages/api/users/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { db } from '@lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, startAt, endAt } from 'firebase/firestore';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];

  const { q } = req.query;
  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return res.status(400).json({ error: 'Query parameter "q" required' });
  }
  
  const searchTerm = q.trim().toLowerCase();

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // const userId = decodedToken.uid;  // Not used here but available if needed

    // Firestore prefix query technique
    // searchName is a lowercase field in user doc
    const usersRef = collection(db, 'users');

    // Create a range for prefix matching
    const endTerm = searchTerm.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
    const usersQuery = query(
      usersRef,
      orderBy('searchName'),
      startAt(searchTerm),
      endAt(endTerm),
      limit(20)
    );

    const snapshot = await getDocs(usersQuery);
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        // include other public profile fields you want to expose
      };
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
}
