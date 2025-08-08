// lib/rate-limit.ts
import { NextApiRequest } from 'next';

const requestCounts = new Map<string, { count: number; firstRequest: number }>();

export const isRateLimited = (req: NextApiRequest): boolean => {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '900') * 1000;
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100');

  // Use IP + path for granular control
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress;
  const path = req.url || '/';
  const key = `${ip}:${path}`;

  const now = Date.now();
  const record = requestCounts.get(key) || { count: 0, firstRequest: now };

  if (now - record.firstRequest > windowMs) {
    requestCounts.set(key, { count: 1, firstRequest: now });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  requestCounts.set(key, { count: record.count + 1, firstRequest: record.firstRequest });
  return false;
};

export const resetRateLimit = (ip: string, path: string = '*') => {
  if (path === '*') {
    for (const key of requestCounts.keys()) {
      if (key.startsWith(ip)) {
        requestCounts.delete(key);
      }
    }
  } else {
    requestCounts.delete(`${ip}:${path}`);
  }
};
