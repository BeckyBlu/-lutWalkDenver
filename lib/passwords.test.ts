import { afterEach, describe, expect, it } from 'vitest';

import { getAdminPassword, getMemberPassword } from './passwords';

describe('password helpers', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns the first configured member password from the supported env keys', () => {
    process.env = { ...originalEnv, MEMBER_PASSWORD: 'member-secret' };

    expect(getMemberPassword()).toBe('member-secret');
  });

  it('falls back to the next member password key when the first is empty', () => {
    process.env = { ...originalEnv, SW_AUTH: 'fallback-secret' };

    expect(getMemberPassword()).toBe('fallback-secret');
  });

  it('uses a default member password when none is configured', () => {
    process.env = { ...originalEnv };
    delete process.env.MEMBER_PASSWORD;
    delete process.env.SW_AUTH;
    delete process.env.sw_auth;
    delete process.env.SW__AUTH;
    delete process.env.sw__auth;

    expect(getMemberPassword()).toBe('member-password');
  });

  it('returns the first configured admin password from the supported env keys', () => {
    process.env = { ...originalEnv, ADMIN_PASSWORD: 'admin-secret' };

    expect(getAdminPassword()).toBe('admin-secret');
  });

  it('falls back to the next admin password key when the first is empty', () => {
    process.env = { ...originalEnv, SW_ADMIN: 'fallback-admin' };

    expect(getAdminPassword()).toBe('fallback-admin');
  });

  it('uses a default admin password when none is configured', () => {
    process.env = { ...originalEnv };
    delete process.env.ADMIN_PASSWORD;
    delete process.env.SW_ADMIN;
    delete process.env.sw_admin;

    expect(getAdminPassword()).toBe('admin-password');
  });
});
