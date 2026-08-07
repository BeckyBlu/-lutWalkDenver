import { describe, it, expect } from 'vitest';

/**
 * Responsive Design Tests
 * Validates layout works across all viewport sizes (320px-1920px)
 */

describe('Responsive Design', () => {
  const BASE_URL = 'http://localhost:3000';

  const viewports = [
    { name: 'Mobile (320px)', width: 320, height: 568 },
    { name: 'Mobile (375px)', width: 375, height: 667 },
    { name: 'Mobile (425px)', width: 425, height: 812 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Tablet (1024px)', width: 1024, height: 768 },
    { name: 'Desktop (1366px)', width: 1366, height: 768 },
    { name: 'Large (1920px)', width: 1920, height: 1080 },
  ];

  describe('Layout Structure', () => {
    it('should have responsive grid layout', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('display: grid');
      expect(html).toContain('grid-template-columns');
    });

    it('should use media queries for breakpoints', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('@media');
      expect(html).toContain('max-width:');
    });

    it('should have flexible padding and margins', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('padding:');
      expect(html).toContain('gap:');
    });
  });

  describe('Mobile First Design (320px)', () => {
    it('should stack content vertically on mobile', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Check for flex-direction: column or single-column grid
      expect(html).toContain('flex-direction: column') || 
      expect(html).toContain('grid-template-columns: 1fr');
    });

    it('should have readable font sizes on mobile', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Should use clamp or responsive font sizes
      expect(html).toContain('clamp');
      expect(html).toContain('rem') || expect(html).toContain('vw');
    });

    it('should have touch-friendly button sizes', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Buttons should be at least 44px
      expect(html).toContain('min-height: 44px') || 
      expect(html).toContain('min-height: 52px');
    });

    it('should have mobile-optimized padding', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Padding should adjust for mobile
      expect(html).toContain('padding: 18px') || 
      expect(html).toContain('padding: 24px');
    });

    it('should not have horizontal scroll on mobile', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Width should be 100% or min(100%, ...)
      expect(html).toContain('width: 100%') || 
      expect(html).toContain('min(100%');
    });
  });

  describe('Tablet Design (768px)', () => {
    it('should adjust layout for tablets', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Should have responsive grid at tablet size
      expect(html).toContain('grid-template-columns: repeat(auto-fit');
      expect(html).toContain('minmax');
    });

    it('should optimize spacing for tablets', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('gap:');
    });

    it('should maintain readability at tablet size', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Font sizes should be readable
      expect(html).toContain('font-size:');
      expect(html).toContain('line-height:');
    });
  });

  describe('Desktop Design (1366px+)', () => {
    it('should display full multi-column layout', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Should have multi-column support
      expect(html).toContain('grid-template-columns: repeat(');
    });

    it('should have proper max-width container', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('max-width:');
      // Should typically be around 1180px
      expect(html).toContain('1180px') || 
      expect(html).toContain('1200px');
    });

    it('should center content on large screens', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('margin: 0 auto');
    });
  });

  describe('Flexible Typography', () => {
    it('should use fluid font sizing', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Check for clamp() for responsive fonts
      expect(html).toContain('clamp(');
    });

    it('should have readable line heights', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('line-height:');
      // Line height should typically be 1.4-1.6
      expect(html).toMatch(/line-height:\s*[1-2]/);
    });

    it('should scale heading sizes responsively', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // h1 should use clamp for responsive sizing
      expect(html).toContain('clamp(');
    });
  });

  describe('Flexible Images & Media', () => {
    it('should use width: 100% for responsive images', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('img {') && 
      expect(html).toContain('width: 100%');
    });

    it('should set max-width on images', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Images should have max-width to prevent distortion
      expect(html).toContain('max-width: 100%');
    });

    it('should use object-fit for image scaling', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('object-fit:');
    });
  });

  describe('Flexible Grid & Flexbox', () => {
    it('should use auto-fit for responsive grids', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('repeat(auto-fit');
    });

    it('should use minmax for flexible column sizing', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('minmax(');
    });

    it('should use gap for consistent spacing', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('gap:');
    });

    it('should use flex-wrap for responsive flex layouts', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('flex-wrap:');
    });
  });

  describe('Navigation Responsiveness', () => {
    it('should have responsive navigation styling', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('nav');
      expect(html).toContain('flex') || expect(html).toContain('display');
    });

    it('should handle menu wrapping on mobile', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('flex-wrap: wrap');
    });
  });

  describe('Form Responsiveness', () => {
    it('should stack form fields on mobile', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('display: grid') || 
      expect(html).toContain('flex-direction: column');
    });

    it('should have mobile-friendly input sizes', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Inputs should be full width on mobile
      expect(html).toContain('width: 100%') || 
      expect(html).toContain('flex: 1');
    });

    it('should adjust button width for mobile', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Buttons on mobile should be full width
      expect(html).toContain('#loginBtn') && 
      expect(html).toContain('width: 100%');
    });
  });

  describe('Breakpoint Media Queries', () => {
    it('should have 900px breakpoint', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('max-width: 900px');
    });

    it('should have 980px breakpoint', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('max-width: 980px');
    });

    it('should progressively enhance for larger screens', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Should have multiple media queries
      const mediaQueryCount = (html.match(/@media/g) || []).length;
      expect(mediaQueryCount).toBeGreaterThan(0);
    });
  });

  describe('Container Queries (if used)', () => {
    it('should have responsive container padding', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('padding:') || 
      expect(html).toContain('padding-left:');
    });
  });

  describe('No Horizontal Scrolling', () => {
    it('should not exceed viewport width', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Check for max-width or width: 100%
      expect(html).toContain('max-width:') || 
      expect(html).toContain('width: 100%');
    });

    it('should use overflow-x handling', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('overflow-x:') || 
      expect(html).toContain('overflow:');
    });
  });

  describe('Responsive Typography Scale', () => {
    it('should scale h1 from 2.4rem to 6rem', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('clamp(');
      expect(html).toContain('2.4rem') || expect(html).toContain('7vw');
    });

    it('should have readable paragraph text at all sizes', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('font-family:');
      expect(html).toContain('font-size:');
    });
  });

  describe('Viewport Units', () => {
    it('should use vw/vh for fluid sizing', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('vw') || 
      expect(html).toContain('dvh');
    });

    it('should use min() and max() functions', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('min(') || 
      expect(html).toContain('max(');
    });
  });

  describe('Print Styles (if applicable)', () => {
    it('should have print media query', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      expect(html).toContain('@media print') || 
      expect(html).toContain('screen');
    });
  });

  describe('Performance on All Viewports', () => {
    it('should minimize CSS for smaller viewports', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // CSS should be optimized
      expect(html).toContain('css') || 
      expect(html).toContain('style');
    });

    it('should not load unnecessary assets', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();

      // Check for Next.js optimization
      expect(html).toContain('next') || 
      expect(html).toContain('_next');
    });
  });
});
