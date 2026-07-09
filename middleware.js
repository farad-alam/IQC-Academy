import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Public routes that authenticated users shouldn't access
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isAuthRoute) {
    const token = req.cookies.get('accessToken')?.value;
    
    if (token) {
      const payload = await verifyAccessToken(token);
      if (payload) {
        // Redirect based on role
        if (payload.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register'],
};
