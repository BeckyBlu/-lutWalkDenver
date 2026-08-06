'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="shell">
          <section className="hero" aria-labelledby="error-title">
            <div className="hero-overlay">
              <p className="eyebrow">Error</p>
              <h1 id="error-title">500 - Server Error</h1>
              <p>
                Something went wrong on our end. We&apos;re working to fix it!
              </p>
              <div className="btn-row">
                <Link className="btn" href="/">
                  Return to Homepage
                </Link>
                <button className="btn btn-secondary" onClick={() => reset()}>
                  Try Again
                </button>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
