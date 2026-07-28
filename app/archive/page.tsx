'use client';

import Link from 'next/link';

export default function ArchivePage() {
  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/zines">Zines</Link></li>
            <li><Link href="/community">Community</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Archive</p>
          <h1>History in motion.</h1>
          <p>
            Browse the preserved stories, posters, press, and photographs that trace
            the growth of SlutWalk Denver over time.
          </p>
        </div>
      </header>

      <section className="featured">
        <h2>Featured collections</h2>
        <div className="archive">
          <article>
            <h3>Photo archive</h3>
            <p>Images from past actions, marches, and community gatherings.</p>
          </article>
          <article>
            <h3>Flyer archive</h3>
            <p>Historic posters, event notices, and call-to-action graphics.</p>
          </article>
          <article>
            <h3>Press archive</h3>
            <p>Media coverage, interviews, and public statements.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
