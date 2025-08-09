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

export const getTrendingUsers = async (
  limitCount = 50,
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

export const searchUsers = async (term: string): Promise<DiscoveryUser[]> => {
  const q = query(collection(db, COLLECTION), where('privacy', '==', 'public'));
  const snap = await getDocs(q);

  return snap.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as User) }))
    .filter((user) => {
      const searchStr = `${user.username} ${user.name} ${user.category}`.toLowerCase();
      return searchStr.includes(term.toLowerCase());
    });
};

export const getUsersByBadge = async (badgeType: string): Promise<DiscoveryUser[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('badges', 'array-contains', badgeType),
    where('privacy', '==', 'public')
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as DiscoveryUser));
};
