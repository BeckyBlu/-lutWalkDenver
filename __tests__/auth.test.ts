import { describe, it, expect, beforeAll, afterAll } from 'vitest';

/**
 * Authentication Tests
 * Validates all auth routes, password handling, and session management
 */

describe('Authentication', () => {
  const BASE_URL = 'http://localhost:3000';
  const MEMBER_PASSWORD = 'GurlGang2030!';
  const ADMIN_PASSWORD = 'Y2K!W3r';
  const WRONG_PASSWORD = 'wrongpassword';

  describe('Member Login', () => {
    it('should accept valid member password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: MEMBER_PASSWORD }),
      });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    it('should reject invalid member password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: WRONG_PASSWORD }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should trim whitespace from password input', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        // Password with leading/trailing spaces
        body: JSON.stringify({ password: `  ${MEMBER_PASSWORD}  ` }),
      });

      expect(response.ok).toBe(true);
    });

    it('should handle empty password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: '' }),
      });

      expect(response.ok).toBe(false);
    });
  });

  describe('Admin Login', () => {
    it('should accept valid admin password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: ADMIN_PASSWORD }),
      });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    it('should reject invalid admin password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: WRONG_PASSWORD }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should reject member password on admin endpoint', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: MEMBER_PASSWORD }),
      });

      expect(response.ok).toBe(false);
    });
  });

  describe('Session Management', () => {
    it('should return session after successful login', async () => {
      // First login
      await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: MEMBER_PASSWORD }),
      });

      // Then check session
      const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
        credentials: 'include',
      });

      expect(sessionResponse.ok).toBe(true);
      const data = await sessionResponse.json() as { role?: string };
      expect(data.role).toBe('member');
    });

    it('should return null role when not authenticated', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/session`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
      const data = await response.json() as { role?: string | null };
      expect(data.role === null || data.role === undefined).toBe(true);
    });

    it('should distinguish between member and admin roles', async () => {
      // Login as admin
      await fetch(`${BASE_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: ADMIN_PASSWORD }),
      });

      const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
        credentials: 'include',
      });

      const data = await sessionResponse.json() as { role?: string };
      expect(data.role).toBe('admin');
    });
  });

  describe('Logout', () => {
    it('should clear session on logout', async () => {
      // Login first
      await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: MEMBER_PASSWORD }),
      });

      // Verify authenticated
      let sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
        credentials: 'include',
      });
      let data = await sessionResponse.json() as { role?: string };
      expect(data.role).toBe('member');

      // Logout
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      // Verify no longer authenticated
      sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
        credentials: 'include',
      });
      data = await sessionResponse.json() as { role?: string | null };
      expect(data.role === null || data.role === undefined).toBe(true);
    });
  });

  describe('Password Input Handling', () => {
    it('should handle special characters in password attempts', async () => {
      const specialPasswords = [
        'password!@#$%',
        'test<script>alert(1)</script>',
        'normal-password',
        'pass word with spaces',
      ];

      for (const pwd of specialPasswords) {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ password: pwd }),
        });

        // Should not throw, just reject
        expect(response.status).toBe(401);
      }
    });

    it('should not expose password in error messages', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: 'secret123' }),
      });

      const errorText = await response.text();
      expect(errorText.toLowerCase()).not.toContain('secret');
      expect(errorText.toLowerCase()).not.toContain('password');
    });
  });

  describe('CORS & Security', () => {
    it('should require Content-Type header', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        // Missing Content-Type header
        body: JSON.stringify({ password: MEMBER_PASSWORD }),
      });

      // Should either reject or require correct header
      expect([400, 415, 401]).toContain(response.status);
    });

    it('should accept credentials in cookie', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: include credentials
        body: JSON.stringify({ password: MEMBER_PASSWORD }),
      });

      expect(response.ok).toBe(true);
    });
  });
});
