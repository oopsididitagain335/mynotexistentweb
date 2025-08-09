// lib/discovery.ts
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

// ✅ Define User interface to match Firestore schema
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
  bannedAt?: Date | null;
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
  lastDoc?: DocumentSnapshot<User>
): Promise<{ users: User[]; lastVisible: DocumentSnapshot<User> | null }> => {
  try {
    // Base query: public profiles, sorted by weekly clicks
    let q = query(
      collection(db, COLLECTION),
      where('privacy', '==', 'public'),
      orderBy('weeklyClicks', 'desc'),
      limit(20)
    );

    // Add category filter if provided
    if (category) {
      q = query(
        collection(db, COLLECTION),
        where('privacy', '==', 'public'),
        where('category', '==', category),
        orderBy('weeklyClicks', 'desc'),
        limit(20)
      );
    }

    // Add cursor pagination if lastDoc exists
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const users: User[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as User;
      // Ensure required fields exist
      if (data.username && data.name) {
        users.push(data);
      }
    });

    const lastVisible = !snapshot.empty ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { users, lastVisible };
  } catch (error) {
    console.error('Error fetching public profiles:', error);
    return { users: [], lastVisible: null };
  }
};

/**
 * Search users by username, name, or bio (fuzzy match client-side)
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
 * Get users by badge (e.g. "Verified", "Trending")
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
      if (data.username && data.name) {
        users.push(data);
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users by badge:', error);
    return [];
  }
};
