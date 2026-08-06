'use client';

import Link from 'next/link';
import { useEffect } from 'react';

const DONATE_GAME_URL = 'https://easmit60-arch.github.io/RSN-Donate_Game/';
const RSN_URL = 'https://rougesupportnetwork.org';

export default function DonatePage() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      root.removeAttribute('data-theme');
      window.localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      window.localStorage.setItem('theme', 'dark');
    }
  };

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

      <section className="card">
        <p className="eyebrow">Support Rouge Support Network</p>
        <h1>Support practical care for sex workers and their communities.</h1>
        <p>
          Donations help support mutual aid, safety resources, and practical care for people facing urgent needs.
          If you want to learn more, visit{' '}
          <a href={RSN_URL} target="_blank" rel="noopener noreferrer" className="link-inline">
            Rouge Support Network
          </a>
          .
        </p>
      </section>

      <div className="action-row">
        <a
          href={DONATE_GAME_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the donation experience"
          className="donate-button"
        >
          $
        </a>
        <p className="support-copy">Choose an amount that feels right for you, then continue to the donation experience.</p>
      </div>

      <button type="button" className="theme-toggle" aria-label="Toggle dark mode" onClick={toggleTheme}>
        T
      </button>

      <style jsx global>{`
        :root {
          --deep-purple: #3a0ca3;
          --light-pink: #ffedf7;
          --light-shadow: rgba(255, 182, 219, 0.45);
          --dark-shadow: rgba(75, 0, 130, 0.2);
          --cyan: rgba(0, 153, 153, 0.9);
          --dark-cyan: rgba(0, 153, 153, 0.18);
          --dark-bg: #111827;
          --dark-bg-secondary: #1f2937;
          --dark-card-bg: rgba(17, 24, 39, 0.92);
          --dark-card-border: rgba(255, 255, 255, 0.12);
          --accent: #4f46e5;
          --accent-soft: #c7d2fe;
          --light-text: #f9fafb;
        }

        * { box-sizing: border-box; }

        body {
          background: linear-gradient(135deg, #ffffff 0%, var(--light-pink) 100%);
          box-shadow:
            inset 0 0 90px var(--light-shadow),
            inset 0 0 60px var(--dark-shadow);
          color: var(--deep-purple);
          font-family: Arial, sans-serif;
          margin: 0;
          min-height: 100vh;
          transition: background 0.3s ease, color 0.3s ease;
        }

        html[data-theme="dark"] body {
          background: linear-gradient(135deg, var(--dark-bg) 0%, var(--dark-bg-secondary) 100%);
          box-shadow:
            inset 0 0 40px var(--cyan),
            inset 0 0 80px var(--dark-cyan);
          color: var(--light-text);
        }

        .donate-shell {
          min-height: 100vh;
          padding: 2rem 1.25rem 3rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          align-items: center;
          justify-content: center;
          max-width: 920px;
          margin: 0 auto;
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
          width: 100%;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 8px 24px rgba(17, 24, 39, 0.08);
          transition: background-color 0.3s ease, border 0.3s ease;
        }

        html[data-theme="dark"] .card {
          background-color: var(--dark-card-bg);
          border: 2px solid var(--dark-card-border);
          color: var(--light-text);
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.78rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .link-inline {
          color: inherit;
          font-weight: 700;
        }

        .action-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
        }

        .support-copy {
          margin: 0;
          max-width: 320px;
          font-weight: 600;
          line-height: 1.5;
        }

        .donate-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          font-size: 2.25rem;
          font-weight: 800;
          text-decoration: none;
          color: white;
          border: 2px solid var(--accent);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.2);
          background: linear-gradient(135deg, var(--accent) 0%, #6366f1 100%);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .donate-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(79, 70, 229, 0.28);
        }

        .theme-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          color: var(--accent);
          border: 1px solid var(--accent-soft);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(17, 24, 39, 0.12);
        }

        html[data-theme="dark"] .theme-toggle {
          background: rgba(17, 24, 39, 0.92);
          color: var(--light-text);
          border-color: var(--dark-card-border);
        }
      `}</style>
    </main>
  );
}
