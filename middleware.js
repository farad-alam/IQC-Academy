import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getAccessSecret = () => new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ─── Protect all /admin/* routes except the login page itself ───
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('accessToken')?.value;

    // No token → send to admin login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, getAccessSecret());

      // Token valid but user isn't admin
      if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }

      // ✅ Authorized — pass through
      return NextResponse.next();
    } catch {
      // Token expired or tampered
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
