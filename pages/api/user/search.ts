// pages/api/user/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

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
    // Search by username or name (case-insensitive)
    const usersRef = collection(db, 'users');

    // Option 1: Simple text search (client-side filter)
    let usersQuery = query(
      usersRef,
      where('privacy', '==', 'public'),
      orderBy('username'),
      limit(20)
    );

    const snapshot = await getDocs(usersQuery);
    const users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => {
        const searchable = `${user.username} ${user.name} ${user.bio || ''} ${user.category || ''}`.toLowerCase();
        return searchable.includes(searchTerm);
      })
      .map(({ password, privateKeyEncrypted, email, ...safe }) => ({
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

    return res.status(200).json(users);
  } catch (error: any) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to search users' });
  }
}
