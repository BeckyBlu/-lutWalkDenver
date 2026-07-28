'use client';

import Link from 'next/link';

export default function CommunityPage() {
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
          <p className="eyebrow">Community</p>
          <h1>Member space and collective care.</h1>
          <p>
            Share updates, join the bulletin board, and stay in conversation with the
            wider organizing circle.
          </p>
        </div>
      </header>

      <section className="featured">
        <h2>Community resources</h2>
        <div className="community-board">
          <article>
            <h3>Announcements</h3>
            <p>Volunteer sign-up, wellness reminders, and upcoming actions.</p>
          </article>
          <article>
            <h3>Bulletin board</h3>
            <p>Community updates, mutual aid offers, and event flyers.</p>
          </article>
          <article>
            <h3>Resources</h3>
            <p>Links to zines, organizers, and local support networks.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
