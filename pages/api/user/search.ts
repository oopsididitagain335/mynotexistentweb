import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// ✅ Define the full User data structure (includes sensitive fields stored in Firestore)
interface UserData {
  id: string;
  username?: string;
  name?: string;
  bio?: string;
  category?: string;
  privacy?: string;
  email?: string;
  password?: string; // 🚨 Exists but will be stripped
  privateKeyEncrypted?: string; // 🚨 Exists but will be stripped
  avatar?: string;
  badges?: string[];
  followersCount?: number;
  weeklyClicks?: number;
  // Add other fields as needed
}

// ✅ Define the public-safe response type (only non-sensitive fields)
interface PublicUser {
  id: string;
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  category?: string;
  badges?: string[];
  followersCount?: number;
  weeklyClicks?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PublicUser[] | { error: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;

  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const searchTerm = q.trim().toLowerCase();

  try {
    // 🔍 Search only public profiles
    const usersRef = collection(db, 'users');
    const usersQuery = query(
      usersRef,
      where('privacy', '==', 'public'),
      orderBy('username'),
      limit(20)
    );

    const snapshot = await getDocs(usersQuery);

    // ✅ Type the raw data from Firestore as UserData
    const users: UserData[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as UserData));

    // 🔎 Filter users based on search term
    const results = users
      .filter(user => {
        const searchable = [
          user.username,
          user.name,
          user.bio,
          user.category,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
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

    // ✅ Return only public-safe user data
    return res.status(200).json(results);
  } catch (error: any) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to search users' });
  }
}
