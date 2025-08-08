// contexts/DiscoveryContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTrendingUsers, searchUsers, getUsersByBadge } from '@lib/discovery';

// ✅ Define the full DiscoveryUser interface locally to avoid import issues
export interface DiscoveryUser {
  id: string;
  uid: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  category: string; // ← This is required for filtering
  privacy: 'public' | 'followers' | 'friends' | 'hidden' | 'banned';
  template: string;
  darkMode: boolean;
  banned: boolean;
  linked: boolean;
  weeklyClicks: number;
  followersCount: number;
  followingCount: number;
  badges: string[];
  links?: Array<{
    emoji: string;
    label: string;
    url: string;
  }>;
  __snapshot?: any; // For pagination
}

interface FilterOptions {
  region?: string;
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

    if (!hasMore && !reset) return;

    try {
      setLoading(true);
      let data = await getTrendingUsers(20, lastDoc);

      // ✅ Now safe — TypeScript knows `category` exists
      if (filters.category) {
        data = data.filter(u => u.category === filters.category);
      }
      if (filters.badge) {
        data = data.filter(u => u.badges?.includes(filters.badge));
      }
      if (filters.template) {
        data = data.filter(u => u.template === filters.template);
      }

      setUsers(prev => (reset ? data : [...prev, ...data]));
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
    if (!term) {
      fetchUsers(true);
      return;
    }
    try {
      setLoading(true);
      const results = await searchUsers(term);
      setUsers(results);
      setHasMore(false);
    } catch (err) {
      setError('Search failed');
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
    loadMore,
  };

  return <DiscoveryContext.Provider value={value}>{children}</DiscoveryContext.Provider>;
};

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);
  if (!context) throw new Error('useDiscovery must be used within DiscoveryProvider');
  return context;
};
