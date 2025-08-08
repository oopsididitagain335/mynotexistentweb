// contexts/DiscoveryContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTrendingUsers, searchUsers, getUsersByBadge } from '@lib/discovery';

// ✅ Full DiscoveryUser interface — matches Firestore
export interface DiscoveryUser {
  id: string;
  uid: string;
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
  weeklyClicks: number;
  followersCount: number;
  followingCount: number;
  badges: string[];
  links: Array<{ emoji: string; label: string; url: string }>;
  __snapshot?: any;
}

interface FilterOptions {
  category?: string;
  badge?: string;
  template?: string;
}

interface DiscoveryContextType {
  users: DiscoveryUser[];
  loading: boolean;
  error: string | null;
  lastDoc: any;
  hasMore: boolean;
  filters: FilterOptions;
  fetchUsers: (reset?: boolean) => Promise<void>;
  search: (term: string) => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  loadMore: () => void;
}

const DiscoveryContext = createContext<DiscoveryContextType>({
  users: [],
  loading: true,
  error: null,
  lastDoc: null,
  hasMore: false,
  filters: {},
  fetchUsers: async () => {},
  search: async () => {},
  setFilters: () => {},
  loadMore: () => {},
});

export const DiscoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<DiscoveryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});

  const fetchUsers = async (reset = false) => {
    if (reset) {
      setUsers([]);
      setLastDoc(null);
      setHasMore(true);
    }

    if (!hasMore) return;

    try {
      setLoading(true);
      let rawData = await getTrendingUsers(20, lastDoc);

      const data: DiscoveryUser[] = rawData.map((item: any) => ({
        id: item.id || item.uid || '',
        uid: item.uid || 'unknown',
        username: item.username || 'unknown',
        name: item.name || item.username || 'Anonymous',
        avatar: item.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anon',
        bio: item.bio || '',
        category: item.category || 'Unknown',
        privacy: item.privacy || 'public',
        template: item.template || 'minimal',
        darkMode: Boolean(item.darkMode),
        banned: Boolean(item.banned),
        linked: Boolean(item.linked),
        weeklyClicks: typeof item.weeklyClicks === 'number' ? item.weeklyClicks : 0,
        followersCount: typeof item.followersCount === 'number' ? item.followersCount : 0,
        followingCount: typeof item.followingCount === 'number' ? item.followingCount : 0,
        badges: Array.isArray(item.badges) ? item.badges : [],
        links: Array.isArray(item.links) ? item.links : [],
        __snapshot: item.__snapshot || null,
      }));

      // Apply filters
      let filteredData = data;
      if (filters.category) {
        filteredData = filteredData.filter(u => u.category === filters.category);
      }
      if (filters.badge) {
        filteredData = filteredData.filter(u => u.badges.includes(filters.badge!));
      }
      if (filters.template) {
        filteredData = filteredData.filter(u => u.template === filters.template);
      }

      setUsers(prev => (reset ? filteredData : [...prev, ...filteredData]));
      setLastDoc(data.length ? data[data.length - 1].__snapshot : null);
      setHasMore(data.length >= 20);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const search = async (term: string) => {
    if (!term.trim()) {
      fetchUsers(true);
      return;
    }
    try {
      setLoading(true);
      const results = await searchUsers(term);
      const typedResults: DiscoveryUser[] = results.map((item: any) => ({
        id: item.id || item.uid || '',
        uid: item.uid || 'unknown',
        username: item.username || 'unknown',
        name: item.name || item.username || 'Anonymous',
        avatar: item.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anon',
        bio: item.bio || '',
        category: item.category || 'Unknown',
        privacy: item.privacy || 'public',
        template: item.template || 'minimal',
        darkMode: Boolean(item.darkMode),
        banned: Boolean(item.banned),
        linked: Boolean(item.linked),
        weeklyClicks: typeof item.weeklyClicks === 'number' ? item.weeklyClicks : 0,
        followersCount: typeof item.followersCount === 'number' ? item.followersCount : 0,
        followingCount: typeof item.followingCount === 'number' ? item.followingCount : 0,
        badges: Array.isArray(item.badges) ? item.badges : [],
        links: Array.isArray(item.links) ? item.links : [],
      }));
      setUsers(typedResults);
      setHasMore(false);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers(true);
  }, [filters]);

  const value = {
    users,
    loading,
    error,
    lastDoc,
    hasMore,
    filters,
    fetchUsers,
    search,
    setFilters,
  };

  return <DiscoveryContext.Provider value={value}>{children}</DiscoveryContext.Provider>;
};

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);
  if (!context) throw new Error('useDiscovery must be used within DiscoveryProvider');
  return context;
};
