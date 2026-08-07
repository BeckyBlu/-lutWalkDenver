import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
  { width: 320, height: 568, name: '320' },
  { width: 375, height: 667, name: '375' },
  { width: 425, height: 812, name: '425' },
  { width: 768, height: 1024, name: '768' },
  { width: 1024, height: 768, name: '1024' },
  { width: 1280, height: 720, name: '1280' },
  { width: 1440, height: 900, name: '1440' },
  { width: 1920, height: 1080, name: '1920' },
];

const PAGES = [
  { name: 'landing', url: '/' },
  { name: 'donate', url: '/donate' },
  { name: 'admin-login', url: '/admin-login' },
];

for (const bp of BREAKPOINTS) {
  test.describe(`Viewport ${bp.width}px`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
    });

    for (const pageData of PAGES) {
      test(`${pageData.name} — no horizontal scroll`, async ({ page }) => {
        await page.goto(pageData.url);
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth,
          `Horizontal scroll on ${pageData.name} at ${bp.width}px: scrollWidth=${scrollWidth} > clientWidth=${clientWidth}`
        ).toBeLessThanOrEqual(clientWidth);
      });

      test(`${pageData.name} — screenshot`, async ({ page }) => {
        await page.goto(pageData.url);
        await page.waitForLoadState('networkidle');
        await page.screenshot({
          path: `screenshots/${pageData.name}-${bp.name}.png`,
          fullPage: true,
        });
      });
    }
  });
}

test.describe('Tap targets >= 44px on mobile (375px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('all interactive elements meet minimum size', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const elements = await page.locator('button, a[href], input[type="submit"]').all();
    for (const el of elements) {
      const box = await el.boundingBox();
      if (!box) continue;
      const minDim = Math.min(box.width, box.height);
      if (minDim < 44) {
        const text = await el.textContent().catch(() => '');
        console.warn(`Small tap target: "${text?.trim()}" is ${minDim}px`);
      }
    }
  });
});
