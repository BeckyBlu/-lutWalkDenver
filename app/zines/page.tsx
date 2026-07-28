'use client';

import Link from 'next/link';

const DONATE_URL = 'https://rougesupportnetwork.org';

export default function ZinesPage() {
  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/shop">Store</Link></li>
            <li><Link href="/bulletin">Bulletin</Link></li>
            <li><Link href="/calendar">Calendar</Link></li>
            <li><Link href="/admin-login">Admin</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Zines</p>
          <h1>Print, story, and resistance.</h1>
          <p>
            Explore zines that bring together artistic practice, survivor testimony,
            and shared strategies for care and action.
          </p>
          <p>
            PDF downloads are available when you donate to{' '}
            <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="link--inline">
              Rouge Support Network
            </a>
            , our non-profit partner.
          </p>
          <div className="btn-row">
            <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="btn">
              Donate to access PDFs →
            </a>
          </div>
        </div>
      </header>

      <section className="featured">
        <h2>Featured issues</h2>
        <div className="zines">
          <article className="zine-card">
            <h3>Issue 01</h3>
            <p>Reclaiming the street through stories, art, and collective memory.</p>
            <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="btn" style={{ display: 'inline-block', marginTop: '0.75rem' }}>
              Donate to download PDF →
            </a>
          </article>
          <article className="zine-card">
            <h3>Issue 02</h3>
            <p>Survivor testimony, media strategy, and tools for solidarity.</p>
            <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="btn" style={{ display: 'inline-block', marginTop: '0.75rem' }}>
              Donate to download PDF →
            </a>
          </article>
        </div>
      </section>
    </main>
  );
}
