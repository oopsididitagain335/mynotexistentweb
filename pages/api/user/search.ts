// pages/api/user/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// ✅ Define the User interface locally
interface User {
  id: string;
  username?: string;
  name?: string;
  bio?: string;
  category?: string;
  privacy?: string;
  // Add other fields you store in Firestore
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;

  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return res.status(400).json({ error: 'Query parameter "q" required' });
  }

  const searchTerm = q.trim().toLowerCase();

  try {
    // Search only public profiles
    const usersRef = collection(db, 'users');
    let usersQuery = query(
      usersRef,
      where('privacy', '==', 'public'),
      orderBy('username'),
      limit(20)
    );

    const snapshot = await getDocs(usersQuery);
    
    // ✅ Type the data properly
    const users: User[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));

    // ✅ Filter on client-side
    const results = users
      .filter(user => {
        const searchable = `${user.username || ''} ${user.name || ''} ${user.bio || ''} ${user.category || ''}`.toLowerCase();
        return searchable.includes(searchTerm);
      })
      .map(({ password, privateKeyEncrypted, email, ...safe }) => ({
        // ✅ Only return safe, public fields
        id: safe.id,
        username: safe.username,
        name: safe.name,
        avatar: safe.avatar,
        bio: safe.bio,
        category: safe.category,
        badges: safe.badges,
        followersCount: safe.followersCount,
        weeklyClicks: safe.weeklyClicks,
      }));

    return res.status(200).json(results);
  } catch (error: any) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to search users' });
  }
}
