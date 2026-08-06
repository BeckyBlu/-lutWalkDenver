'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main className="shell">
          <section className="hero" aria-labelledby="error-title">
            <div className="hero-overlay">
              <p className="eyebrow">Error</p>
              <h1 id="error-title">404 - Page Not Found</h1>
              <p>
                Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
              <div className="btn-row">
                <Link className="btn" href="/">
                  Return to Homepage
                </Link>
                <Link className="btn btn-secondary" href="/community">
                  Go to Community Hub
                </Link>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
