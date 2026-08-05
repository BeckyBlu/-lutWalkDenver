/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimize images for modern formats
    formats: ['image/avif', 'image/webp'],
    // Minimum cache time for images (in seconds)
    
  },
  
  
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/login.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/bulletin.html', destination: '/bulletin', permanent: true },
      { source: '/calendar.html', destination: '/calendar', permanent: true },
      { source: '/community.html', destination: '/community', permanent: true },
      { source: '/zine.html', destination: '/zines', permanent: true },
      { source: '/admin-login.html', destination: '/admin-login', permanent: true },
      // Add redirects for new pages
      { source: '/organizing.html', destination: '/organizing', permanent: true },
      { source: '/education.html', destination: '/education', permanent: true },
      { source: '/care.html', destination: '/care', permanent: true },
      { source: '/privacy.html', destination: '/privacy', permanent: true },
      { source: '/terms.html', destination: '/terms', permanent: true },
      { source: '/accessibility.html', destination: '/accessibility', permanent: true },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js requires unsafe-inline for its hydration scripts and inline styles.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      // Firebase Storage hosts uploaded images; data:/blob: cover local previews.
      // In an I2P deployment, storage.googleapis.com requests will fail silently
      // (images won't load) but no JS executes against it — acceptable tradeoff.
      "img-src 'self' data: blob: https://storage.googleapis.com",
      // All Firestore/Auth calls are now server-side only, so connect-src is 'self'.
      "connect-src 'self'",
      "font-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
