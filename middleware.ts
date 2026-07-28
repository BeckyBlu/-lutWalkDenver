import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = [
  '/archive',
  '/bulletin',
  '/calendar',
  '/community',
  '/events',
  '/shop',
  '/zines',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const token = request.cookies.get('sw_auth')?.value;

    if (!token) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/archive/:path*', '/bulletin/:path*', '/calendar/:path*', '/community/:path*', '/events/:path*', '/shop/:path*', '/zines/:path*'],
};