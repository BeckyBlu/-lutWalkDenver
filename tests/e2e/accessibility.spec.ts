import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PUBLIC_PAGES = [
  { name: 'landing', url: '/' },
  { name: 'donate', url: '/donate' },
  { name: 'admin-login', url: '/admin-login' },
];

const PROTECTED_PAGES = [
  { name: 'organizing', url: '/organizing' },
  { name: 'education', url: '/education' },
  { name: 'care', url: '/care' },
  { name: 'shop', url: '/shop' },
  { name: 'bulletin', url: '/bulletin' },
  { name: 'chat', url: '/chat' },
  { name: 'calendar', url: '/calendar' },
  { name: 'community', url: '/community' },
  { name: 'zines', url: '/zines' },
  { name: 'archive', url: '/archive' },
  { name: 'events', url: '/events' },
];

test.describe('Accessibility — axe-core WCAG AA', () => {
  for (const page of PUBLIC_PAGES) {
    test(`${page.name} — 0 axe violations`, async ({ page: browserPage }) => {
      await browserPage.goto(page.url);
      const results = await new AxeBuilder({ page: browserPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations,
        `Violations on ${page.name}:\n${JSON.stringify(results.violations, null, 2)}`
      ).toHaveLength(0);
    });
  }

  for (const page of PROTECTED_PAGES) {
    test(`${page.name} — 0 axe violations (authenticated)`, async ({ page: browserPage, request }) => {
      test.skip(!process.env.MEMBER_PASSWORD, 'MEMBER_PASSWORD not set');

      const response = await request.post('/api/auth/login', {
        data: { password: process.env.MEMBER_PASSWORD.trim() },
      });
      test.skip(!response.ok(), 'Auth failed — skipping authenticated a11y test');

      const setCookie = await response.headers()['set-cookie'];
      if (setCookie) {
        const match = setCookie.match(/sw_auth=([^;]+)/);
        if (match) {
          await browserPage.context().addCookies([{
            name: 'sw_auth',
            value: match[1],
            domain: new URL(browserPage.url() || 'http://localhost').hostname,
            path: '/',
          }]);
        }
      }

      await browserPage.goto(page.url);
      const results = await new AxeBuilder({ page: browserPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations,
        `Violations on ${page.name}:\n${JSON.stringify(results.violations, null, 2)}`
      ).toHaveLength(0);
    });
  }
});
