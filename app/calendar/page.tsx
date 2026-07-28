'use client';

import Link from 'next/link';

export default function CalendarPage() {
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
            <li><Link href="/admin-login">Admin</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Community calendar</p>
          <h1>Meetings, workshops, rallies, and volunteer shifts.</h1>
          <p>The calendar page is designed as a future-ready hub for events and reminders.</p>
        </div>
      </header>

      <section className="featured">
        <h2>Upcoming events</h2>
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
