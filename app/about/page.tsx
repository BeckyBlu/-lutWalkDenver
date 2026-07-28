'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/archive">Archive</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/zines">Zines</Link></li>
            <li><Link href="/community">Community</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">About</p>
          <h1>Roots, purpose, and future direction.</h1>
          <p>
            SlutWalk Denver is a survivor-led collective organizing around safety,
            visibility, solidarity, and public accountability.
          </p>
        </div>
      </header>

      <section className="featured">
        <h2>What this movement stands for</h2>
        <p>
          We build community through care, direct action, education, and media that
          reflects lived experience rather than shame or blame.
        </p>
      </section>
    </main>
  );
}
