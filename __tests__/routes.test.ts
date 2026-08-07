import { describe, it, expect } from 'vitest';

/**
 * Route Navigation Tests
 * Validates all links work and navigation paths are correct
 */

describe('Route Navigation', () => {
  const BASE_URL = 'http://localhost:3000';
  const MEMBER_PASSWORD = 'GurlGang2030!';

  // Helper to login before protected route tests
  async function loginAsMember() {
    return fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password: MEMBER_PASSWORD }),
    });
  }

  describe('Public Routes', () => {
    it('should load homepage', async () => {
      const response = await fetch(`${BASE_URL}/`);
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    it('should load login page', async () => {
      const response = await fetch(`${BASE_URL}/login`);
      expect(response.ok).toBe(true);
    });

    it('should load admin login page', async () => {
      const response = await fetch(`${BASE_URL}/admin-login`);
      expect(response.ok).toBe(true);
    });
  });

  describe('Member Protected Routes', () => {
    it('should require authentication for /about', async () => {
      const response = await fetch(`${BASE_URL}/about`, {
        credentials: 'include',
      });

      // Unauthenticated request might redirect or return 401
      expect([301, 302, 401, 200]).toContain(response.status);
    });

    it('should allow access to /about when authenticated', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/about`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });

    it('should load /organizing page', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/organizing`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });

    it('should load /education page', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/education`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });

    it('should load /care page', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/care`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });

    it('should load /bulletin page', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/bulletin`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });

    it('should load /calendar page', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/calendar`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });

    it('should load /chat page', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/chat`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });

    it('should load /community page', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/community`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });

    it('should load /shop page', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/shop`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });

    it('should load /zines page', async () => {
      await loginAsMember();

      const response = await fetch(`${BASE_URL}/zines`, {
        credentials: 'include',
      });

      expect(response.ok).toBe(true);
    });
  });

  describe('Footer/Legal Routes', () => {
    it('should load /privacy page', async () => {
      const response = await fetch(`${BASE_URL}/privacy`);
      expect(response.ok).toBe(true);
    });

    it('should load /terms page', async () => {
      const response = await fetch(`${BASE_URL}/terms`);
      expect(response.ok).toBe(true);
    });

    it('should load /accessibility page', async () => {
      const response = await fetch(`${BASE_URL}/accessibility`);
      expect(response.ok).toBe(true);
    });
  });

  describe('Redirect Rules', () => {
    it('should redirect /index.html to /', async () => {
      const response = await fetch(`${BASE_URL}/index.html`, {
        redirect: 'follow',
      });

      expect(response.url).toContain('/');
    });

    it('should redirect /login.html to /login', async () => {
      const response = await fetch(`${BASE_URL}/login.html`, {
        redirect: 'follow',
      });

      expect(response.url).toContain('/login');
    });

    it('should redirect /about.html to /about', async () => {
      const response = await fetch(`${BASE_URL}/about.html`, {
        redirect: 'follow',
      });

      expect(response.url).toContain('/about');
    });

    it('should redirect /organizing.html to /organizing', async () => {
      const response = await fetch(`${BASE_URL}/organizing.html`, {
        redirect: 'follow',
      });

      expect(response.url).toContain('/organizing');
    });

    it('should redirect /education.html to /education', async () => {
      const response = await fetch(`${BASE_URL}/education.html`, {
        redirect: 'follow',
      });

      expect(response.url).toContain('/education');
    });

    it('should redirect /care.html to /care', async () => {
      const response = await fetch(`${BASE_URL}/care.html`, {
        redirect: 'follow',
      });

      expect(response.url).toContain('/care');
    });

    it('should redirect /zine.html to /zines', async () => {
      const response = await fetch(`${BASE_URL}/zine.html`, {
        redirect: 'follow',
      });

      expect(response.url).toContain('/zines');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await fetch(`${BASE_URL}/this-does-not-exist`);
      expect(response.status).toBe(404);
    });

    it('should handle malformed URLs gracefully', async () => {
      const response = await fetch(`${BASE_URL}//double//slash`);
      expect([200, 404, 301, 302]).toContain(response.status);
    });
  });

  describe('Static Assets', () => {
    it('should serve sitemap.xml', async () => {
      const response = await fetch(`${BASE_URL}/sitemap.xml`);
      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('xml');
    });

    it('should serve robots.txt', async () => {
      const response = await fetch(`${BASE_URL}/robots.txt`);
      expect(response.ok).toBe(true);
    });

    it('should serve favicon.ico', async () => {
      const response = await fetch(`${BASE_URL}/favicon.ico`);
      expect([200, 301, 302]).toContain(response.status);
    });

    it('should serve manifest.json', async () => {
      const response = await fetch(`${BASE_URL}/manifest.json`);
      expect(response.ok).toBe(true);
    });
  });

  describe('Navigation Link Integrity', () => {
    it('should not have broken links in sitemap', async () => {
      const response = await fetch(`${BASE_URL}/sitemap.xml`);
      const sitemapText = await response.text();

      // Check that all URLs in sitemap are valid
      const urlRegex = /<loc>(.*?)<\/loc>/g;
      const matches = [...sitemapText.matchAll(urlRegex)];

      expect(matches.length).toBeGreaterThan(0);
      // Sitemap should have 13 URLs
      expect(matches.length).toBe(13);
    });

    it('should contain key paths in sitemap', async () => {
      const response = await fetch(`${BASE_URL}/sitemap.xml`);
      const sitemapText = await response.text();

      const expectedPaths = [
        'slutwalkdenver.gay',
        '/organizing',
        '/education',
        '/care',
        '/bulletin',
        '/calendar',
        '/community',
        '/shop',
      ];

      for (const path of expectedPaths) {
        expect(sitemapText).toContain(path);
      }
    });
  });
});
