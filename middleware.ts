import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth-edge';

// Paths that require either a member or admin token
const AUTH_REQUIRED_PATHS = [
  '/archive',
  '/bulletin',
  '/calendar',
  '/community',
  '/events',
  '/shop',
  '/zines',
];

const ADMIN_PATHS = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin-only routes: require the sw_admin cookie
  if (ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const adminToken = request.cookies.get('sw_admin')?.value;
    if (!adminToken || !(await verifyTokenEdge(adminToken))) {
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
      (memberToken && (await verifyTokenEdge(memberToken))) ||
      (adminToken && (await verifyTokenEdge(adminToken)));

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
    '/community/:path*',
    '/events/:path*',
    '/shop/:path*',
    '/zines/:path*',
  ],
};