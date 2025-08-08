// lib/tokens.ts
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';

// Generate 32-char token, expires in 15 mins
export const generateLinkToken = (): { token: string; expiresAt: Date } => {
  const token = uuidv4().replace(/-/g, '').substring(0, 32);
  const expiresAt = addMinutes(new Date(), 15);
  return { token, expiresAt };
};

// Validate token (check expiry)
export const isValidToken = (expiresAt: Date): boolean => {
  return new Date() < new Date(expiresAt);
};
