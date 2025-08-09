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

export const getTrendingUsers = async (
  limitCount = 20,
  lastDoc?: DocumentSnapshot<User> | null
) => {
  const constraints = [
    where('privacy', '==', 'public'),
    orderBy('weeklyClicks', 'desc'),
  ];
  if (lastDoc) constraints.push(startAfter(lastDoc));
  constraints.push(limit(limitCount));

  const q = query(collection(db, COLLECTION), ...constraints);

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...(doc.data() as User),
    id: doc.id,
    __snapshot: doc,
  }));
};

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
        user.username.toLowerCase().includes(term.toLowerCase()) ||
        user.name.toLowerCase().includes(term.toLowerCase())
    );
};

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
