import crypto from 'crypto';

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url');
}

function getAuthSecret() {
  return process.env.AUTH_SECRET ?? '';
}

export function signToken(payload: Record<string, unknown>) {
  const authSecret = getAuthSecret();

  if (!authSecret) {
    throw new Error('AUTH_SECRET is not configured');
  }

  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TOKEN_TTL_SECONDS;
  const body = { ...payload, iat, exp };
  const encoded = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}`;
  const signature = crypto.createHmac('sha256', authSecret).update(encoded).digest('base64url');

  return `${encoded}.${signature}`;
}

export function verifyToken(token: string) {
  const authSecret = getAuthSecret();

  if (!token || !authSecret) {
    return null;
  }

  try {
    const [encodedHeader, encodedBody, signature] = token.split('.');

    if (!encodedHeader || !encodedBody || !signature) {
      return null;
    }

    const unsigned = `${encodedHeader}.${encodedBody}`;
    const expectedSignature = crypto.createHmac('sha256', authSecret).update(unsigned).digest('base64url');

    // Compare decoded buffers so timingSafeEqual operates on raw bytes
    const sigBuf = Buffer.from(signature, 'base64url');
    const expBuf = Buffer.from(expectedSignature, 'base64url');

    // Compare decoded byte buffers. timingSafeEqual throws a RangeError for
    // mismatched buffer lengths, which the surrounding try/catch converts to null.
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedBody, 'base64url').toString('utf8'));

    // Reject expired tokens
    if (typeof payload.exp !== 'number' || Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}