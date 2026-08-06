import crypto from 'crypto';
import { afterEach, describe, expect, it } from 'vitest';

import { signToken, verifyToken } from './auth';

describe('auth token helpers', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('signs a token and verifies it for a valid payload', () => {
    process.env.AUTH_SECRET = 'super-secret';

    const token = signToken({ sub: 'member' });

    expect(token).toContain('.');
    expect(verifyToken(token)).toMatchObject({ sub: 'member' });
  });

  it('returns null when the token is invalid or malformed', () => {
    process.env.AUTH_SECRET = 'super-secret';

    expect(verifyToken('not-a-jwt')).toBeNull();
    expect(verifyToken('header.body')).toBeNull();
  });

  it('returns null when the signature is tampered with', () => {
    process.env.AUTH_SECRET = 'super-secret';

    const token = signToken({ sub: 'member' });
    const parts = token.split('.');
    const tampered = `${parts[0]}.${parts[1]}.${parts[2].slice(0, -1)}x`;

    expect(verifyToken(tampered)).toBeNull();
  });

  it('returns null when the token has expired', () => {
    process.env.AUTH_SECRET = 'super-secret';

    const expiredPayload = { sub: 'member', exp: Math.floor(Date.now() / 1000) - 60 };
    const encodedHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const encodedBody = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
    const unsigned = `${encodedHeader}.${encodedBody}`;
    const signature = crypto.createHmac('sha256', 'super-secret').update(unsigned).digest('base64url');
    const token = `${unsigned}.${signature}`;

    expect(verifyToken(token)).toBeNull();
  });

  it('uses a fallback secret when AUTH_SECRET is not configured', () => {
    delete process.env.AUTH_SECRET;

    const token = signToken({ sub: 'member' });

    expect(token).toContain('.');
    expect(verifyToken(token)).toMatchObject({ sub: 'member' });
  });

  it('includes issued at and expiration claims in verified payloads', () => {
    process.env.AUTH_SECRET = 'super-secret';

    const token = signToken({ sub: 'member' });
    const payload = verifyToken(token);

    expect(payload).toMatchObject({ sub: 'member' });
    expect(payload).toHaveProperty('iat');
    expect(payload).toHaveProperty('exp');
    expect(typeof payload?.iat).toBe('number');
    expect(typeof payload?.exp).toBe('number');
  });
});
