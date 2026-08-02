import { describe, expect, it } from 'vitest';
import { decryptText, encryptText } from './e2e-chat';

describe('e2e chat helpers', () => {
  it('encrypts and decrypts text with AES-GCM', async () => {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt'],
    );

    const payload = await encryptText('hello from the safety room', key);

    expect(payload.type).toBe('aes-gcm');
    expect(payload.iv).toBeTruthy();

    const plaintext = await decryptText(payload, key);
    expect(plaintext).toBe('hello from the safety room');
  });
});
