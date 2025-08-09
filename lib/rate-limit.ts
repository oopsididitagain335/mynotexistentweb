// lib/rate-limit.ts
import { NextApiRequest } from 'next';

const requestCounts = new Map<string, { count: number; firstRequest: number }>();

export const isRateLimited = (req: NextApiRequest): boolean => {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '900', 10) * 1000;
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown';

  const path = req.url || '/';
  const key = `${ip}:${path}`;

  const now = Date.now();
  const record = requestCounts.get(key) || { count: 0, firstRequest: now };

  // Reset after window
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

export const resetRateLimit = (ip: string, path: string = '*'): void => {
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
