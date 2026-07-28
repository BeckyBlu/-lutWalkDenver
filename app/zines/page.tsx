'use client';

import Link from 'next/link';

export default function ZinesPage() {
  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/archive">Archive</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/community">Community</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Zines</p>
          <h1>Print, story, and resistance.</h1>
          <p>
            Explore zines that bring together artistic practice, survivor testimony,
            and shared strategies for care and action.
          </p>
        </div>
      </header>

      <section className="featured">
        <h2>Featured issues</h2>
        <div className="zines">
          <article className="zine-card">
            <h3>Issue 01</h3>
            <p>Reclaiming the street through stories, art, and collective memory.</p>
          </article>
          <article className="zine-card">
            <h3>Issue 02</h3>
            <p>Survivor testimony, media strategy, and tools for solidarity.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
