import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // CSRF: reject cross-origin requests that supply an Origin header
  const origin = request.headers.get('origin');
  if (origin !== null && origin !== 'null') {
    const expectedOrigin = new URL(request.url).origin;
    if (origin !== expectedOrigin) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: 'sw_admin',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
