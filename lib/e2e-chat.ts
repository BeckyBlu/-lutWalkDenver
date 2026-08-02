export type E2EEncryptedPayload = {
  type: 'aes-gcm';
  iv: string;
  ciphertext: string;
  authTag: string;
};

export async function encryptText(plaintext: string, key: CryptoKey): Promise<E2EEncryptedPayload> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertextBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const ciphertext = new Uint8Array(ciphertextBuffer);

  const tag = ciphertext.slice(-16);
  const body = ciphertext.slice(0, ciphertext.length - 16);

  return {
    type: 'aes-gcm',
    iv: Buffer.from(iv).toString('base64'),
    ciphertext: Buffer.from(body).toString('base64'),
    authTag: Buffer.from(tag).toString('base64'),
  };
}

export async function decryptText(payload: E2EEncryptedPayload, key: CryptoKey): Promise<string> {
  const iv = Buffer.from(payload.iv, 'base64');
  const ciphertext = Buffer.from(payload.ciphertext, 'base64');
  const authTag = Buffer.from(payload.authTag, 'base64');
  const combined = Buffer.concat([ciphertext, authTag]);

  const plaintextBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, combined);
  return new TextDecoder().decode(plaintextBuffer);
}

export async function generateEncryptionKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
}

export function exportKeyToBase64(key: CryptoKey): Promise<string> {
  return crypto.subtle.exportKey('raw', key).then((buffer) => Buffer.from(buffer).toString('base64'));
}

export function importKeyFromBase64(base64: string): Promise<CryptoKey> {
  const raw = Buffer.from(base64, 'base64');
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
