// pages/api/middleware.ts
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

export function middleware(req: NextRequest, _ev: NextFetchEvent) {
  // Block all requests if maintenance mode is enabled
  if (process.env.MAINTENANCE_MODE === 'true') {
    return new Response('Under maintenance', {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }

  // Create a response to add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'); // HSTS
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}
