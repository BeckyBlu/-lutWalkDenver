/**
 * Edge-runtime JWT verification using the Web Crypto API.
 * Next.js middleware runs in the Edge runtime, so it cannot import Node.js modules
 * (such as the `crypto` built-in used in lib/auth.ts). This module provides an
 * async verifyToken that is compatible with both Edge and Node.js runtimes.
 */

function base64urlDecode(b64url: string): ArrayBuffer {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function verifyTokenEdge(token: string): Promise<Record<string, unknown> | null> {
  const secret = process.env.AUTH_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedBody, signature] = parts;

    const unsigned = `${encodedHeader}.${encodedBody}`;
    const encoder = new TextEncoder();

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );

    // crypto.subtle.verify is timing-safe by specification
    const isValid = await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      base64urlDecode(signature),
      encoder.encode(unsigned),
    );

    if (!isValid) {
      return null;
    }

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(encodedBody)));

    // Reject expired tokens
    if (typeof payload.exp !== 'number' || Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }

    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}
