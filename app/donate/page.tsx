'use client';

import Link from 'next/link';

const RSN_URL = 'https://rougesupportnetwork.org';
const BEDPAGE_URL = 'https://denver.bedpage.com/Massage/denver-wheatridge-co-light-travel/523534.html';

export default function DonatePage() {
  return (
    <main className="donate-shell">
      <header className="donate-hero">
        <nav className="donate-nav" aria-label="Primary">
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/shop">Store</Link></li>
            <li><Link href="/zines">Zines</Link></li>
            <li><Link href="/admin-login">Admin</Link></li>
          </ul>
        </nav>
      </header>

      <section className="card" aria-labelledby="donate-title">
        <p className="eyebrow">Support and care</p>
        <h1 id="donate-title">Support practical care for people and communities.</h1>
        <p>
          If you are looking for support resources, direct care, or ways to contribute, these links are a starting point.
          The goal is simple: make it easier to find help, share care, and move with dignity.
        </p>
      </section>

      <section className="card" aria-labelledby="resources-title">
        <h2 id="resources-title">Resources</h2>
        <ul className="resource-list">
          <li>
            <a href={RSN_URL} target="_blank" rel="noopener noreferrer">
              Rouge Support Network
            </a>
          </li>
          <li>
            <a href={BEDPAGE_URL} target="_blank" rel="noopener noreferrer">
              Denver listing reference
            </a>
          </li>
        </ul>
      </section>

      <section className="card card--quiet" aria-labelledby="quote-title">
        <h2 id="quote-title">A simple reminder</h2>
        <p>
          “You yourself, as much as anybody in the entire universe, deserve your love and affection.”
          <br />
          <span className="quote-attribution">— Buddha Shakyamuni</span>
        </p>
      </section>

      <style jsx global>{`
        :root {
          color-scheme: light;
          --page-bg: #f7f4f0;
          --surface: #ffffff;
          --border: #d9d2ca;
          --text: #2f241d;
          --muted: #64584f;
          --accent: #7c4d2b;
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          background: var(--page-bg);
          color: var(--text);
        }

        .donate-shell {
          min-height: 100vh;
          max-width: 860px;
          margin: 0 auto;
          padding: 2rem 1.25rem 3rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .donate-hero {
          width: 100%;
        }

        .donate-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .logo {
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .donate-nav ul {
          display: flex;
          gap: 1rem;
          list-style: none;
          padding: 0;
          margin: 0;
          flex-wrap: wrap;
        }

        .donate-nav a {
          color: inherit;
          text-decoration: none;
          font-weight: 600;
        }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 8px 24px rgba(47, 36, 29, 0.06);
        }

        .card--quiet {
          border-style: dashed;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 0.8rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: var(--accent);
        }

        .resource-list {
          margin: 0;
          padding-left: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .resource-list a {
          color: inherit;
          font-weight: 600;
        }

        .quote-attribution {
          display: block;
          margin-top: 0.5rem;
          color: var(--muted);
          font-style: italic;
        }
      `}</style>
    </main>
  );
}
