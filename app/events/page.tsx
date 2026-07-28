'use client';

import Link from 'next/link';

export default function EventsPage() {
  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/archive">Archive</Link></li>
            <li><Link href="/zines">Zines</Link></li>
            <li><Link href="/community">Community</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Events</p>
          <h1>Gatherings, circles, and public action.</h1>
          <p>
            Join upcoming volunteer orientation, solidarity rallies, and community
            planning sessions.
          </p>
        </div>
      </header>

      <section className="featured">
        <h2>Upcoming gatherings</h2>
        <div className="events">
          <article>
            <h3>Volunteer orientation</h3>
            <p>Sunday • 4:00 PM • Planning circle and resource sharing.</p>
          </article>
          <article>
            <h3>Solidarity rally</h3>
            <p>Saturday • 11:00 AM • Public gathering and outreach.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
