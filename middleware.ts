import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth-edge';

// Paths that require either a member or admin token
const AUTH_REQUIRED_PATHS = [
  '/archive',
  '/bulletin',
  '/calendar',
  '/care',
  '/chat',
  '/community',
  '/education',
  '/events',
  '/organizing',
  '/shop',
  '/zines',
];

const ADMIN_PATHS = ['/admin'];

async function tokenHasRole(token: string | undefined, role: 'member' | 'admin') {
  if (!token) return false;
  const claims = await verifyTokenEdge(token);
  return claims?.sub === role;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin-only routes: require the sw_admin cookie
  if (ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const adminToken = request.cookies.get('sw_admin')?.value;
    if (!(await tokenHasRole(adminToken, 'admin'))) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin-login';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Routes that accept either a member token or an admin token
  if (AUTH_REQUIRED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const memberToken = request.cookies.get('sw_auth')?.value;
    const adminToken = request.cookies.get('sw_admin')?.value;
    const isAuthorized =
      (await tokenHasRole(memberToken, 'member')) ||
      (await tokenHasRole(adminToken, 'admin'));

    if (!isAuthorized) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/archive/:path*',
    '/bulletin/:path*',
    '/calendar/:path*',
    '/care/:path*',
    '/chat/:path*',
    '/community/:path*',
    '/education/:path*',
    '/events/:path*',
    '/organizing/:path*',
    '/shop/:path*',
    '/zines/:path*',
  ],
};