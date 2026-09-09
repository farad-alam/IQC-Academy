import { NextResponse } from 'next/server';
import { verifyAccessToken } from './lib/auth'; // jose — Edge compatible
import { getSiteLiveFromCache } from './lib/cache/siteLive'; // Redis — Edge compatible

// ─── Route definitions ────────────────────────────────────────────────────────

// Pages that logged-in users should be redirected AWAY from
const AUTH_PAGES = ['/login', '/register', '/admin/login'];

// Pages that require an authenticated (any role) user
const PROTECTED_USER_PAGES = ['/dashboard', '/profile', '/donate', '/quizzes'];

// ── Paths that don't exist in this app — fast-reject scanner/bot traffic ──────
// These paths appear thousands of times in Vercel logs (bots probing for
// common CMS/API endpoints). Return immediately — no Redis, no JWT, no CPU.
const SCANNER_PATH_PREFIXES = [
  '/api/demo', '/api/generate', '/api/blog',
  '/blog/', '/wp-', '/wordpress', '/xmlrpc',
  '/.env', '/admin.php', '/phpmyadmin',
  '/api/v1', '/api/v2', '/api/v3',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getUserFromToken(token) {
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return null;
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

// ─── Main proxy / middleware function ────────────────────────────────────────

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  // ── 0. Fast-exit: scanner/bot paths that don't exist in this app ──────────
  // These generate tens of thousands of hits. Skip ALL processing and let
  // Next.js serve a 404 instantly with zero CPU cost.
  if (SCANNER_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // ── 1. Attempt to resolve the current user ────────────────────────────────

  let user = await getUserFromToken(accessToken);
  let refreshedCookies = null;

  // Auto-refresh: if access token is missing/expired but refresh token exists,
  // transparently call the refresh endpoint and obtain a new access token.
  if (!user && refreshToken) {
    try {
      const refreshUrl = new URL('/api/auth/refresh', request.url);
      const refreshRes = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          // Forward only the refreshToken cookie to the refresh endpoint
          cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        refreshedCookies = refreshRes.headers.getSetCookie?.() ?? [];

        // Extract the new accessToken to determine the user's role
        const atCookie = refreshedCookies.find((c) =>
          c.startsWith('accessToken=')
        );
        if (atCookie) {
          const atValue = atCookie.split(';')[0].replace('accessToken=', '');
          user = await getUserFromToken(atValue);
        }
      }
    } catch {
      // Refresh failed — treat user as unauthenticated; silent redirect happens below
    }
  }

  // ── 2. Route classification ───────────────────────────────────────────────

  const isAdminPage =
    pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isProtectedUserPage = PROTECTED_USER_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  // ── 3. Redirect logic ─────────────────────────────────────────────────────

  let response;

  if (isAuthPage && user) {
    // Logged-in user visiting /login, /register, or /admin/login
    // → send them to their appropriate dashboard
    const dest =
      (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? '/admin/dashboard' : '/dashboard';
    response = NextResponse.redirect(new URL(dest, request.url));
  } else if (isAdminPage) {
    // Admin page — must be an authenticated ADMIN or SUPER_ADMIN.
    // Skip maintenance check: admins are already authenticated and the admin
    // panel must always be accessible even when site is in maintenance mode.
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      response = NextResponse.redirect(new URL('/admin/login', request.url));
    } else {
      response = NextResponse.next(); // ← no Redis call needed
    }
  } else if (isProtectedUserPage && !user) {
    // Protected user page — must be logged in
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    response = NextResponse.redirect(loginUrl);
  } else if (isProtectedUserPage && user) {
    // Protected user page and user IS logged in — skip maintenance check.
    // These are personal dashboards, not public content.
    response = NextResponse.next(); // ← no Redis call needed
  } else {
    // ── Maintenance Mode Check ────────────────────────────────────────────────
    // Read from Redis cache — no HTTP round-trip, no DB query.
    // Falls back to true (site is live) if Redis is unavailable.
    // Only run for public pages (not admin, not /api, not already handled above).
    if (pathname !== '/maintenance' && !pathname.startsWith('/api')) {
      const isLive = await getSiteLiveFromCache();
      if (!isLive) {
        response = NextResponse.redirect(new URL('/maintenance', request.url));
      } else {
        response = NextResponse.next();
      }
    } else {
      response = NextResponse.next();
    }
  }

  // ── 4. Security headers ───────────────────────────────────────────────────
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // ── 5. Forward any refreshed cookies to the browser ──────────────────────
  if (refreshedCookies?.length) {
    refreshedCookies.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });
  }

  return response;
}

// ─── Matcher — exclude static files and API routes ───────────────────────────
// API routes handle their own auth via getAuthUser() — no need to intercept them here.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicon.png|images/|.*\\.png|.*\\.jpg|.*\\.ico|.*\\.svg|.*\\.webp|api).*)',
  ],
};
