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
