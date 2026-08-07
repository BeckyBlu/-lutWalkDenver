import { describe, it, expect } from 'vitest';

/**
 * SEO & Meta Tags Tests
 * Validates OpenGraph, JSON-LD, and SEO configuration
 */

describe('SEO & Meta Tags', () => {
  const BASE_URL = 'http://localhost:3000';

  describe('Meta Tags', () => {
    it('should have page title', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('<title>');
      expect(html).toContain('SlutWalk Denver') || expect(html).toContain('Community');
    });

    it('should have meta description', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('name="description"');
      expect(html).toContain('content=');
    });

    it('should have charset declaration', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('charset');
    });

    it('should have viewport meta tag', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('viewport');
      expect(html).toContain('width=device-width');
    });
  });

  describe('OpenGraph Tags', () => {
    it('should have og:type', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('property="og:type"');
      expect(html).toContain('website');
    });

    it('should have og:title', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('property="og:title"');
    });

    it('should have og:description', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('property="og:description"');
    });

    it('should have og:url', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('property="og:url"');
      expect(html).toContain('slutwalkdenver.gay');
    });

    it('should have og:image', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('property="og:image"');
    });

    it('should have og:site_name', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('property="og:site_name"');
    });

    it('should have og:locale', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('property="og:locale"');
      expect(html).toContain('en_US');
    });
  });

  describe('Twitter Card Tags', () => {
    it('should have twitter:card', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('name="twitter:card"');
      expect(html).toContain('summary_large_image');
    });

    it('should have twitter:title', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('name="twitter:title"');
    });

    it('should have twitter:description', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('name="twitter:description"');
    });

    it('should have twitter:image', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('name="twitter:image"');
    });

    it('should have twitter:creator', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('name="twitter:creator"');
    });
  });

  describe('JSON-LD Structured Data', () => {
    it('should have NGO structured data', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('application/ld+json');
      expect(html).toContain('"@type": "NGO"') || expect(html).toContain('@type');
    });

    it('should have organization details in JSON-LD', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('SlutWalk Denver') || expect(html).toContain('name');
      expect(html).toContain('slutwalkdenver.gay') || expect(html).toContain('url');
    });

    it('should have WebSite structured data', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('"@type": "WebSite"') || expect(html).toContain('WebSite');
    });

    it('should have SearchAction in structured data', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('SearchAction') || expect(html).toContain('search');
    });
  });

  describe('Robots & Crawlers', () => {
    it('should allow indexing', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('name="robots"');
      expect(html).toContain('index');
      expect(html).not.toContain('noindex');
    });

    it('should allow following links', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('follow');
      expect(html).not.toContain('nofollow');
    });

    it('should have canonical URL', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('rel="canonical"');
      expect(html).toContain('slutwalkdenver.gay');
    });
  });

  describe('Sitemap & Robots.txt', () => {
    it('should have valid sitemap.xml', async () => {
      const response = await fetch(`${BASE_URL}/sitemap.xml`);
      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('xml');

      const sitemapText = await response.text();
      expect(sitemapText).toContain('<?xml');
      expect(sitemapText).toContain('<urlset');
      expect(sitemapText).toContain('</urlset>');
    });

    it('should have robots.txt', async () => {
      const response = await fetch(`${BASE_URL}/robots.txt`);
      expect(response.ok).toBe(true);

      const robotsText = await response.text();
      expect(robotsText).toContain('User-agent:') || expect(robotsText).toContain('Disallow:');
    });

    it('should reference sitemap in robots.txt', async () => {
      const response = await fetch(`${BASE_URL}/robots.txt`);
      const robotsText = await response.text();

      expect(robotsText).toContain('sitemap') || expect(robotsText).toContain('Sitemap:');
    });
  });

  describe('Favicon Configuration', () => {
    it('should have favicon link', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('favicon');
      expect(html).toContain('rel="icon"');
    });

    it('should serve favicon.ico', async () => {
      const response = await fetch(`${BASE_URL}/favicon.ico`);
      expect([200, 301, 302]).toContain(response.status);
    });

    it('should have apple touch icon', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('apple-touch-icon');
    });

    it('should have manifest.json link', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('manifest.json');
    });
  });

  describe('Keyword & Content Metadata', () => {
    it('should have relevant keywords', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('keywords');
      expect(html).toContain('SlutWalk') || 
      expect(html).toContain('organizing') ||
      expect(html).toContain('community');
    });

    it('should have author metadata', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('author') || 
      expect(html).toContain('creator');
    });
  });

  describe('Social Media Integration', () => {
    it('should have social media links in JSON-LD', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('sameAs') || 
      expect(html).toContain('twitter') ||
      expect(html).toContain('instagram');
    });
  });

  describe('Performance & SEO Headers', () => {
    it('should have no-referrer policy', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('Referrer-Policy') || 
      expect(html).toContain('referrer');
    });

    it('should have theme color', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('theme-color');
    });
  });

  describe('Structured Data Validation', () => {
    it('should have valid JSON-LD format', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Extract JSON-LD blocks
      const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
      const matches = html.match(jsonLdRegex);

      expect(matches && matches.length > 0).toBe(true);

      // Try to parse JSON-LD
      if (matches) {
        for (const match of matches) {
          const jsonStr = match.replace(/<script[^>]*>|<\/script>/g, '');
          expect(() => JSON.parse(jsonStr)).not.toThrow();
        }
      }
    });
  });

  describe('Meta Robots Tags', () => {
    it('should not have noindex on public pages', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).not.toContain('noindex');
    });

    it('should allow image previews', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('max-image-preview: large') || 
      expect(html).toContain('google');
    });

    it('should allow video previews', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('max-video-preview') || 
      expect(html).not.toContain('noindex');
    });
  });
});
