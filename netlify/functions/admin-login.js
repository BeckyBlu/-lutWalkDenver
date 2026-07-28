const crypto = require('crypto');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const AUTH_SECRET = process.env.AUTH_SECRET || '';
const ADMIN_TOKEN_MAX_AGE = 60 * 60 * 8; // 8 hours

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function signToken(payload) {
  if (!AUTH_SECRET) {
    throw new Error('AUTH_SECRET is not configured');
  }

  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ADMIN_TOKEN_MAX_AGE;
  const body = { ...payload, iat, exp };
  const encoded = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(encoded).digest('base64url');

  return `${encoded}.${signature}`;
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false }) };
  }

  // CSRF: reject cross-origin requests that supply an Origin header
  const origin = event.headers['origin'];
  if (origin && origin !== 'null') {
    const host = event.headers['host'];
    const proto = event.headers['x-forwarded-proto'] || 'https';
    const expectedOrigin = `${proto}://${host}`;
    if (origin !== expectedOrigin) {
      return { statusCode: 403, body: JSON.stringify({ ok: false }) };
    }
  }

  const { password } = JSON.parse(event.body || '{}');

  if (!ADMIN_PASSWORD || !password || password !== ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ ok: false }) };
  }

  const token = signToken({ sub: 'admin' });

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': `sw_admin=${token}; HttpOnly; Path=/; Max-Age=${ADMIN_TOKEN_MAX_AGE}; SameSite=Lax; Secure`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true }),
  };
};
