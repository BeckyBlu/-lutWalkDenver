'use client';

import Link from 'next/link';

export default function BulletinPage() {
  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/shop">Store</Link></li>
            <li><Link href="/calendar">Calendar</Link></li>
            <li><Link href="/admin-login">Admin</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Bulletin board</p>
          <h1>Announcements, requests, and collective updates.</h1>
          <p>Members can coordinate volunteer opportunities, mutual aid requests, and projects in one shared space.</p>
        </div>
      </header>

      <section className="featured">
        <h2>Community posts</h2>
        <div className="community-board">
          <article>
            <h3>Announcements</h3>
            <p>Volunteer sign-up, wellness reminders, and upcoming actions.</p>
          </article>
          <article>
            <h3>Mutual aid</h3>
            <p>Ride shares, food support, and local resource sharing.</p>
          </article>
          <article>
            <h3>Discussion topics</h3>
            <p>Education circles, event planning, and archive collaboration.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
