import { NextResponse } from 'next/server';

import { signToken } from '../../../../lib/auth';
import { getAdminPassword } from '../../../../lib/passwords';

const ADMIN_TOKEN_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(request: Request) {
  // CSRF: reject cross-origin requests that supply an Origin header
  const origin = request.headers.get('origin');
  if (origin !== null && origin !== 'null') {
    const expectedOrigin = new URL(request.url).origin;
    if (origin !== expectedOrigin) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  try {
    const { password } = await request.json();
    const adminPassword = getAdminPassword();

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = signToken({ sub: 'admin' });
    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: 'sw_admin',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: ADMIN_TOKEN_MAX_AGE,
    });

    // Keep admin/member sessions isolated: admin login clears any member session.
    response.cookies.set({
      name: 'sw_auth',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
