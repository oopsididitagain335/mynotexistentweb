// lib/discovery.ts
import { db } from './firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore';
import type { User } from '../../pages/api/user/types';

const COLLECTION = 'users';

export interface DiscoveryUser extends User {
  id: string;
}

/**
 * Get trending users (public, high engagement)
 */
export const getTrendingUsers = async (
  limitCount: number = 50,
  lastDoc?: DocumentSnapshot
): Promise<DiscoveryUser[]> => {
  let q = query(
    collection(db, COLLECTION),
    where('privacy', '==', 'public'),
    orderBy('weeklyClicks', 'desc'),
    limit(limitCount)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as DiscoveryUser));
};

/**
 * Search users by username, name, or category (fuzzy via client)
 */
export const searchUsers = async (term: string): Promise<DiscoveryUser[]> => {
  const q = query(collection(db, COLLECTION), where('privacy', '==', 'public'));
  const snap = await getDocs(q);
  const users: DiscoveryUser[] = [];

  for (const doc of snap.docs) {
    const data = doc.data() as User;
    const searchStr = `${data.username} ${data.name} ${data.category}`.toLowerCase();
    if (searchStr.includes(term.toLowerCase())) {
      users.push({ id: doc.id, ...data });
    }
  }

  return users;
};

/**
 * Get users by badge
 */
export const getUsersByBadge = async (badgeType: string): Promise<DiscoveryUser[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('badges', 'array-contains', badgeType),
    where('privacy', '==', 'public')
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as DiscoveryUser));
};
