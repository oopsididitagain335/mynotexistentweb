// lib/discovery.ts
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

// ✅ Define User interface exactly as stored in Firestore
export interface User {
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  category?: string;
  privacy: 'public' | 'followers' | 'friends' | 'hidden' | 'banned';
  template?: string;
  darkMode?: boolean;
  weeklyClicks?: number;
  followersCount?: number;
  followingCount?: number;
  badges?: string[];
  links?: Array<{
    emoji: string;
    label: string;
    url: string;
  }>;
  email?: string;
  uid?: string;
  discord?: {
    id: string;
    username: string;
  } | null;
  linked?: boolean;
  previousPrivacy?: string;
  banned?: boolean;
  bannedAt?: any; // Firestore Timestamp
  bannedBy?: string | null;
  publicKey?: string;
  privateKeyEncrypted?: {
    encrypted: string;
    salt: string;
    nonce: string;
  } | null;
}

const COLLECTION = 'users';

/**
 * Fetch public profiles with optional category filter and pagination
 */
export const getPublicProfiles = async (
  category?: string,
  lastDoc?: QueryDocumentSnapshot<User> | null
): Promise<{
  users: User[];
  lastVisible: QueryDocumentSnapshot<User> | null;
}> => {
  try {
    // Base query
    let q = query(
      collection(db, COLLECTION),
      where('privacy', '==', 'public'),
      orderBy('weeklyClicks', 'desc'),
      limit(20)
    );

    // Add category filter if needed
    if (category) {
      q = query(
        collection(db, COLLECTION),
        where('privacy', '==', 'public'),
        where('category', '==', category),
        orderBy('weeklyClicks', 'desc'),
        limit(20)
      );
    }

    // Add pagination cursor
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const users: User[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as User;

      // ✅ Validate required fields
      if (!data.username || !data.name || !data.privacy) {
        console.warn(`Invalid user data skipped: ${doc.id}`);
        return;
      }

      users.push(data);
    });

    // ✅ Type assertion: we know this is a QueryDocumentSnapshot<User>
    const lastVisible = !snapshot.empty
      ? (snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot<User>)
      : null;

    return { users, lastVisible };
  } catch (error) {
    console.error('Error fetching public profiles:', error);
    return { users: [], lastVisible: null };
  }
};

/**
 * Search users by username, name, bio, or category (client-side fuzzy search)
 */
export const searchUsers = async (term: string): Promise<User[]> => {
  if (!term.trim()) return [];

  try {
    const q = query(collection(db, COLLECTION), where('privacy', '==', 'public'));
    const snapshot = await getDocs(q);
    const users: User[] = [];
    const searchStr = term.toLowerCase().trim();

    snapshot.forEach((doc) => {
      const data = doc.data() as User;
      if (!data.username || !data.name) return;

      const searchable = `${data.username} ${data.name} ${data.bio || ''} ${data.category || ''}`.toLowerCase();
      if (searchable.includes(searchStr)) {
        users.push(data);
      }
    });

    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

/**
 * Get users who have a specific badge
 */
export const getUsersByBadge = async (badge: string): Promise<User[]> => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('privacy', '==', 'public'),
      where('badges', 'array-contains', badge)
    );
    const snapshot = await getDocs(q);
    const users: User[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as User;
      if (data.username && data.name && data.badges?.includes(badge)) {
        users.push(data);
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users by badge:', error);
    return [];
  }
};
