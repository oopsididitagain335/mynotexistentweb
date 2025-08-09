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

// ✅ Integrated User type directly here
export interface User {
  username: string;
  name: string;
  category?: string;
  privacy: 'public' | 'private' | 'banned';
  weeklyClicks?: number;
  badges?: string[];
  email?: string;
  uid?: string;
  discord?: string | null;
  linked?: boolean;
  previousPrivacy?: string;
  banned?: boolean;
  bannedAt?: Date | null;
  bannedBy?: string | null;
}

const COLLECTION = 'users';

/**
 * Fetch public profiles with optional category filter
 */
export const getPublicProfiles = async (
  category?: string,
  lastDoc?: DocumentSnapshot<User>
): Promise<{ users: User[]; lastVisible: DocumentSnapshot<User> | null }> => {
  try {
    let q = query(
      collection(db, COLLECTION),
      where('privacy', '==', 'public'),
      orderBy('weeklyClicks', 'desc'),
      limit(20)
    );

    if (category) {
      q = query(
        collection(db, COLLECTION),
        where('privacy', '==', 'public'),
        where('category', '==', category),
        orderBy('weeklyClicks', 'desc'),
        limit(20)
      );
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const users: User[] = snapshot.docs.map(doc => doc.data() as User);
    const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { users, lastVisible };
  } catch (error) {
    console.error('Error fetching public profiles:', error);
    return { users: [], lastVisible: null };
  }
};
