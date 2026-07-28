import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET ?? '';

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url');
}

export function signToken(payload: Record<string, unknown>) {
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

export function verifyToken(token: string) {
  if (!token || !AUTH_SECRET) {
    return null;
  }

  try {
    const [encodedHeader, encodedBody, signature] = token.split('.');

    if (!encodedHeader || !encodedBody || !signature) {
      return null;
    }

    const unsigned = `${encodedHeader}.${encodedBody}`;
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(unsigned).digest('base64url');

    if (signature.length !== expectedSignature.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    return JSON.parse(Buffer.from(encodedBody, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}