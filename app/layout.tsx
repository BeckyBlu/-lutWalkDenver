import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: {
    default: '$lutWalk Denver | Community Hub for Organizing, Education & Care',
    template: '%s | $lutWalk Denver',
  },
  description: 'SlutWalk Denver is a living collective for community organizing, education, and mutual aid. Access resources, events, and member spaces.',
  keywords: ['SlutWalk Denver', 'sex worker rights', 'bodily autonomy', 'mutual aid', 'community organizing', 'education', 'zines'],
  authors: [{ name: 'SlutWalk Denver Collective' }],
  creator: 'SlutWalk Denver Collective',
  publisher: 'SlutWalk Denver Collective',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://slutwalkdenver.gay',
    siteName: '$lutWalk Denver',
    title: '$lutWalk Denver',
    description: 'A living collective for organizing, education, and mutual aid in Denver.',
    images: [
      {
        url: 'https://slutwalkdenver.gay/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '$lutWalk Denver - Community Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '$lutWalk Denver',
    description: 'Community hub for sex worker rights and bodily autonomy.',
    images: ['https://slutwalkdenver.gay/images/twitter-card.jpg'],
    creator: '@SlutWalkDenver',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#120f13" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="$lutWalk Denver" />
        <meta name="application-name" content="$lutWalk Denver" />
        <meta name="msapplication-TileColor" content="#120f13" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://slutwalkdenver.gay" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Security headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NGO",
            "name": "SlutWalk Denver",
            "url": "https://slutwalkdenver.gay",
            "description": "A survivor-led community space for SlutWalk Denver. A living collective for organizing, education, and mutual aid.",
            "foundingDate": "2011",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Denver",
              "addressRegion": "CO",
              "addressCountry": "US"
            },
            "sameAs": [
              "https://twitter.com/SlutWalkDenver",
              "https://instagram.com/SlutWalkDenver",
              "https://mastodon.social/@SlutWalkDenver"
            ]
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SlutWalk Denver",
            "url": "https://slutwalkdenver.gay",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://slutwalkdenver.gay/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
        <Footer />
      </body>
    </html>
  );
}