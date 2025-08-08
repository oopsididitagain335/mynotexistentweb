// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Define the exact User interface as stored in Firestore
export interface User {
  uid: string;
  email: string | null;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  category: string;
  privacy: 'public' | 'followers' | 'friends' | 'hidden' | 'banned';
  template: string;
  darkMode: boolean;
  banned: boolean;
  linked: boolean;
  discord?: {
    id: string;
    username: string;
  } | null;
  weeklyClicks: number;
  followersCount: number;
  followingCount: number;
  badges: string[];
  publicKey: string;
  privateKeyEncrypted: {
    encrypted: string;
    salt: string;
    nonce: string;
  } | null;
  links: Array<{
    emoji: string;
    label: string;
    url: string;
  }>;
  createdAt?: any; // Firestore Timestamp
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  error: null,
  refreshUserProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUserProfile = async () => {
    if (!currentUser) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        setError('Profile not found.');
        setUserProfile(null);
        setLoading(false);
        return;
      }

      const data = userDocSnap.data();

      // Validate required fields
      if (!data.uid || !data.username || !data.email) {
        setError('Profile data is invalid or incomplete.');
        setLoading(false);
        return;
      }

      // Build safe User object with defaults
      const safeProfile: User = {
        uid: data.uid,
        email: data.email,
        username: data.username,
        name: data.name || data.username,
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        bio: data.bio || '',
        category: data.category || 'Creator',
        privacy: data.privacy || 'public',
        template: data.template || 'minimal',
        darkMode: Boolean(data.darkMode),
        banned: Boolean(data.banned),
        linked: Boolean(data.linked),
        discord: data.discord || null,
        weeklyClicks: Number(data.weeklyClicks) || 0,
        followersCount: Number(data.followersCount) || 0,
        followingCount: Number(data.followingCount) || 0,
        badges: Array.isArray(data.badges) ? data.badges : [],
        publicKey: data.publicKey || '',
        privateKeyEncrypted: data.privateKeyEncrypted || null,
        links: Array.isArray(data.links) ? data.links : [],
        createdAt: data.createdAt || null,
      };

      setUserProfile(safeProfile);
      setError(null);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await refreshUserProfile();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
