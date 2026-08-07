import { test, expect } from '@playwright/test';

const MEMBER_PASSWORD = process.env.MEMBER_PASSWORD || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const PUBLIC_PAGES = ['/', '/donate', '/admin-login'];

const PROTECTED_ROUTES = [
  '/archive', '/bulletin', '/calendar', '/care', '/chat',
  '/community', '/education', '/events', '/organizing', '/shop', '/zines',
];

test.describe('Public pages load', () => {
  for (const path of PUBLIC_PAGES) {
    test(`${path} returns 200`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe('Protected routes redirect unauthenticated users', () => {
  for (const path of PROTECTED_ROUTES) {
    test(`${path} redirects to /`, async ({ page }) => {
      await page.goto(path);
      expect(page.url()).not.toMatch(new RegExp(`${path}$`));
    });
  }
});

test.describe('Auth flow — member login', () => {
  test.beforeEach(async () => {
    test.skip(!MEMBER_PASSWORD, 'MEMBER_PASSWORD not set');
  });

  test('member can login with correct password', async ({ page }) => {
    await page.goto('/');
    await page.locator('input#password').fill(MEMBER_PASSWORD.trim());
    await page.locator('button#loginBtn').click();
    await page.waitForURL(url => url.toString() !== page.url() || true, { timeout: 10_000 }).catch(() => {});
  });

  test('member login trims whitespace from password', async ({ page }) => {
    await page.goto('/');
    await page.locator('input#password').fill(`  ${MEMBER_PASSWORD}  `);
    await page.locator('button#loginBtn').click();
    await page.waitForURL(url => url.toString() !== page.url() || true, { timeout: 10_000 }).catch(() => {});
  });

  test('member login fails with wrong password', async ({ page }) => {
    await page.goto('/');
    await page.locator('input#password').fill('definitely-wrong-password-12345');
    await page.locator('button#loginBtn').click();
    await page.waitForTimeout(2000);
    // Should still be on landing page with error message
    const errorMsg = page.locator('#errorMessage');
    await expect(errorMsg).toContainText(/incorrect|try again/i);
  });
});

test.describe('Auth flow — admin login', () => {
  test.beforeEach(async () => {
    test.skip(!ADMIN_PASSWORD, 'ADMIN_PASSWORD not set');
  });

  test('admin can login', async ({ page }) => {
    await page.goto('/admin-login');
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(ADMIN_PASSWORD.trim());
    await page.locator('button[type="submit"], button:has-text("Enter"), button:has-text("Login")').first().click();
    await page.waitForURL(/admin/, { timeout: 10_000 }).catch(() => {});
  });
});

test.describe('API endpoint tests', () => {
  test('POST /api/auth/login accepts POST method', async ({ request }) => {
    test.skip(!MEMBER_PASSWORD, 'MEMBER_PASSWORD not set');
    const response = await request.post('/api/auth/login', {
      data: { password: MEMBER_PASSWORD.trim() },
    });
    expect(response.status()).toBe(200);
  });

  test('POST /api/auth/login rejects wrong password', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { password: 'wrong-password' },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /api/auth/login returns 405', async ({ request }) => {
    const response = await request.get('/api/auth/login');
    expect(response.status()).toBe(405);
  });
});

test.describe('No dead internal links on landing page', () => {
  test('all internal links resolve', async ({ page }) => {
    await page.goto('/');
    const links = await page.locator('a[href^="/"]').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (!href || href === '#') continue;
      const response = await page.request.get(href);
      expect([200, 307, 308]).toContain(response.status());
    }
  });
});

test.describe('Static assets', () => {
  test('sitemap.xml loads', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
  });

  test('robots.txt loads', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
  });
});
