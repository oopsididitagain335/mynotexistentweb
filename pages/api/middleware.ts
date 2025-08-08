// pages/api/middleware.ts
import { NextFetchEvent, NextRequest } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Block if maintenance mode
  if (process.env.MAINTENANCE_MODE === 'true') {
    return new Response('Under maintenance', { status: 503 });
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}
