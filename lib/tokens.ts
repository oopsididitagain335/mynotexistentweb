// lib/tokens.ts
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';

/**
 * Generate a secure 32-character token that expires in 15 minutes.
 */
export const generateLinkToken = (): { token: string; expiresAt: Date } => {
  const token = uuidv4().replace(/-/g, '').substring(0, 32);
  const expiresAt = addMinutes(new Date(), 15);
  return { token, expiresAt };
};

/**
 * Validate if a token is still valid based on expiry.
 */
export const isValidToken = (expiresAt: Date): boolean => {
  return new Date() < new Date(expiresAt);
};
