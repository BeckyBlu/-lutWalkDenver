'use client';

import Link from 'next/link';

export default function ShopPage() {
  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/bulletin">Bulletin</Link></li>
            <li><Link href="/calendar">Calendar</Link></li>
            <li><Link href="/admin-login">Admin</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Community store</p>
          <h1>Support the work through education and merch.</h1>
          <p>Future-ready store experience with apparel, stickers, zines, posters, and event merchandise.</p>
        </div>
      </header>

      <section className="featured">
        <h2>Planned collections</h2>
        <div className="zines">
          <article className="zine-card">
            <h3>Apparel</h3>
            <p>Shirts, hats, and prints that support organizing and visibility.</p>
          </article>
          <article className="zine-card">
            <h3>Stickers & zines</h3>
            <p>Low-cost tools for outreach, education, and mutual aid.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
