import { NextResponse } from 'next/server';
import { verifyAccessToken } from './lib/auth'; // Note: jose works in edge runtime

// Add routes that require authentication
const protectedRoutes = ['/profile', '/courses', '/quizzes', '/donate'];
const adminRoutes = ['/admin'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Security Headers
  const response = NextResponse.next();
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // 2. Auth checks
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route)) || pathname.startsWith('/api/users') || pathname.startsWith('/api/admin');
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route)) || pathname.startsWith('/api/admin');

  if (isProtected) {
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify token (jose works on Edge runtime)
    const payload = await verifyAccessToken(token);
    
    if (!payload) {
      // Access token invalid/expired, frontend needs to call /api/auth/refresh
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized', code: 'TOKEN_EXPIRED' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAdminRoute && payload.role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except static assets and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.png|.*\\.jpg).*)',
  ],
};
