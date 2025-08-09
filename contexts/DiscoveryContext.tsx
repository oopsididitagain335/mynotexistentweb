import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

// Integrated User type
export interface User {
  id?: string;
  uid: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  category?: string;
  privacy: 'public' | 'followers' | 'friends' | 'hidden' | 'banned';
  template?: string;
  darkMode?: boolean;
  banned?: boolean;
  linked?: boolean;
  weeklyClicks?: number;
  followersCount?: number;
  followingCount?: number;
  badges?: string[];
  links?: Array<{ emoji: string; label: string; url: string }>;
  __snapshot?: any;
}

const COLLECTION = 'users';

/** Get trending users */
export const getTrendingUsers = async (
  limitCount = 20,
  lastDoc?: DocumentSnapshot<User> | null
) => {
  let q = query(
    collection(db, COLLECTION),
    where('privacy', '==', 'public'),
    orderBy('weeklyClicks', 'desc'),
    limit(limitCount)
  );

  if (lastDoc) {
    q = query(
      collection(db, COLLECTION),
      where('privacy', '==', 'public'),
      orderBy('weeklyClicks', 'desc'),
      startAfter(lastDoc),
      limit(limitCount)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...(doc.data() as User),
    id: doc.id,
    __snapshot: doc,
  }));
};

/** Search users by username or name */
export const searchUsers = async (term: string) => {
  if (!term.trim()) return [];

  const q = query(
    collection(db, COLLECTION),
    where('privacy', '==', 'public'),
    orderBy('username'),
    limit(50)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({
      ...(doc.data() as User),
      id: doc.id,
      __snapshot: doc,
    }))
    .filter(
      user =>
        user.username?.toLowerCase().includes(term.toLowerCase()) ||
        user.name?.toLowerCase().includes(term.toLowerCase())
    );
};

/** Get users that have a specific badge */
export const getUsersByBadge = async (badge: string) => {
  const q = query(
    collection(db, COLLECTION),
    where('privacy', '==', 'public'),
    where('badges', 'array-contains', badge),
    orderBy('weeklyClicks', 'desc'),
    limit(20)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...(doc.data() as User),
    id: doc.id,
    __snapshot: doc,
  }));
};
