const crypto = require('crypto');

const MEMBER_PASSWORD = process.env.MEMBER_PASSWORD || '';
const AUTH_SECRET = process.env.AUTH_SECRET || '';

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function signToken(payload) {
  if (!AUTH_SECRET) {
    throw new Error('AUTH_SECRET is not configured');
  }

  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat };
  const encoded = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(encoded).digest('base64url');

  return `${encoded}.${signature}`;
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false }) };
  }

  const { password } = JSON.parse(event.body || '{}');

  if (!password || password !== MEMBER_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ ok: false }) };
  }

  const token = signToken({ sub: 'member' });

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': `sw_auth=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true }),
  };
};