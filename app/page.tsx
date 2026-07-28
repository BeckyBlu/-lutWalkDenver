'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { GateModel } from './gate-model';
import { initialGateModel } from './gate-model';

const ACCESS_KEY = 'slutwalk-access';

export default function HomePage() {
  const [gateModel, setGateModel] = useState<GateModel>(initialGateModel);
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('Members enter the shared password to unlock the dashboard.');

  useEffect(() => {
    let active = true;

    async function syncSession() {
      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        const data = await response.json() as { role?: 'member' | 'admin' | null };
        const isUnlocked = data.role === 'member' || data.role === 'admin';

        if (!active) return;
        setUnlocked(isUnlocked);
        window.localStorage.setItem(ACCESS_KEY, String(isUnlocked));
        setMessage(isUnlocked ? 'Welcome back. Your member dashboard is ready.' : 'Members enter the shared password to unlock the dashboard.');
      } catch {
        if (!active) return;
        window.localStorage.removeItem(ACCESS_KEY);
        setUnlocked(false);
      }
    }

    void syncSession();

    return () => { active = false; };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password: gateModel.password }),
    });

    if (response.ok) {
      window.localStorage.setItem(ACCESS_KEY, 'true');
      setUnlocked(true);
      setGateModel(initialGateModel);
      setMessage('Welcome back. Your member dashboard is ready.');
      return;
    }

    window.localStorage.removeItem(ACCESS_KEY);
    setUnlocked(false);
    setMessage('Incorrect password. Please try again or contact an organizer.');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    window.localStorage.removeItem(ACCESS_KEY);
    setUnlocked(false);
  };

  const handleDecline = () => {
    window.localStorage.removeItem(ACCESS_KEY);
    window.location.href = '/';
  };

  return (
    <>
      {!unlocked && (
        <div id="gateModal" className="gate-modal">
          <div className="gate-card">
            <h1>$lutWalk Denver</h1>
            <p className="subtitle">Community Member Access</p>

            <form className="gate-form gate-modal-form" onSubmit={handleSubmit}>
              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                value={gateModel.password}
                onChange={(event) => setGateModel({ ...gateModel, password: event.target.value })}
              />
              <div className="gate-modal-buttons">
                <button id="loginBtn" type="submit">Enter Community</button>
                <button type="button" id="declineBtn" className="decline-btn" onClick={handleDecline}>
                  Leave
                </button>
              </div>
              <p id="errorMessage" className="helper">{message}</p>
            </form>
          </div>
        </div>
      )}

      <div id="siteContent" style={{ display: unlocked ? 'block' : 'none' }}>
        <main className="shell">
          <header className="hero">
            <nav>
              <div className="logo">$lutWalk Denver</div>

              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/shop">Store</Link></li>
                <li><Link href="/bulletin">Bulletin</Link></li>
                <li><Link href="/calendar">Calendar</Link></li>
                <li><Link href="/admin-login">Admin</Link></li>
              </ul>
            </nav>

        <div className="hero-overlay">
          <p className="eyebrow">Community hub</p>
          <h1>$lutWalk Denver is a living collective.</h1>

          <p>
            A public landing page for community information, a protected member dashboard,
            and a separate administrator portal for organizers.
          </p>

          <div className="btn-row">
            <Link className="btn" href="/about">Enter member space</Link>
            <Link className="btn btn-secondary" href="/admin-login">Administrator portal</Link>
            <button className="btn btn-secondary" type="button" onClick={() => void handleLogout()}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="featured">
        <p className="eyebrow">Public landing page</p>
        <h2>Built for organizing, education, and collective care.</h2>
        <p>
          This landing view welcomes new visitors, shares community information,
          and directs members into the protected pages for organizing and resource sharing.
        </p>
        <div className="notice-grid">
          <article>
            <h3>Accessibility statement</h3>
            <p>Keyboard-friendly navigation, strong contrast, and clear structure support inclusive access.</p>
          </article>
          <article>
            <h3>Privacy notice</h3>
            <p>Member access is enforced with secure, httpOnly session cookies and can be cleared at any time.</p>
          </article>
        </div>
      </section>

      <section className={`content ${unlocked ? 'content--open' : 'content--locked'}`}>
        <p className="eyebrow">Member dashboard</p>
        <h2>Welcome back, organizer.</h2>
        <p>Move between the protected pages for about, store, bulletin board, calendar, and administration.</p>

        <div className="dashboard-grid">
          <Link className="dashboard-card" href="/about">
            <h3>About SlutWalk Denver</h3>
            <p>History, mission, values, archive links, and educational materials.</p>
          </Link>
          <Link className="dashboard-card" href="/shop">
            <h3>Community Store</h3>
            <p>Support the collective with apparel, zines, posters, and future event merch.</p>
          </Link>
          <Link className="dashboard-card" href="/bulletin">
            <h3>Bulletin Board</h3>
            <p>Announcements, volunteer opportunities, mutual aid requests, and discussion topics.</p>
          </Link>
          <Link className="dashboard-card" href="/calendar">
            <h3>Community Calendar</h3>
            <p>Meetings, marches, workshops, volunteer shifts, and community gatherings.</p>
          </Link>
          <Link className="dashboard-card" href="/admin-login">
            <h3>Administrator Portal</h3>
            <p>Separate access for moderation, archive uploads, event management, and member oversight.</p>
          </Link>
        </div>

        <aside className="notice-grid" style={{ marginTop: '2rem' }}>
          <article>
            <h3>🔒 Privacy-first access via I2P</h3>
            <p>
              For maximum privacy, access this community through our{' '}
              <strong>I2P eepsite</strong>. Your IP address never reaches our
              servers — traffic is routed through the I2P anonymity network end-to-end.
              See{' '}
              <a href="https://github.com/BeckyBlu/-lutWalkDenver/blob/main/i2p.md" target="_blank" rel="noopener noreferrer">
                the I2P setup guide
              </a>{' '}
              for installation and connection instructions.
            </p>
          </article>
        </aside>

        <section className="timeline">
          <article>
            <h2>2011</h2>
            <p>First Denver SlutWalk.</p>
          </article>

          <article>
            <h2>2020</h2>
            <p>Hybrid organizing and expanded inclusion.</p>
          </article>

          <article>
            <h2>2021</h2>
            <p>Carnival-style community rally.</p>
          </article>

          <article>
            <h2>2022</h2>
            <p>Archive and community media expansion.</p>
          </article>
        </section>

        <section className="zines">
          <article className="zine-card">
            <p className="eyebrow">Zine spotlight</p>
            <h3>Issue 01</h3>
            <p>Reclaiming the street through stories, art, and collective memory.</p>
          </article>

          <article className="zine-card">
            <p className="eyebrow">Zine spotlight</p>
            <h3>Issue 02</h3>
            <p>Survivor testimony, media strategy, and tools for solidarity.</p>
          </article>
        </section>

        <section className="events">
          <article>
            <p className="eyebrow">Upcoming event</p>
            <h3>Volunteer orientation</h3>
            <p>Sunday • 4:00 PM • Planning circle and resource sharing.</p>
          </article>

          <article>
            <p className="eyebrow">Upcoming event</p>
            <h3>Solidarity rally</h3>
            <p>Saturday • 11:00 AM • Public gathering and outreach.</p>
          </article>
        </section>

        <section className="community-board">
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
        </section>

        <section className="chatroom">
          <article>
            <p className="eyebrow">Members chat</p>
            <h3>Community chatroom</h3>
            <p>Share logistics, planning notes, and solidarity updates with members.</p>
          </article>
        </section>

        <section className="archive">
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
        </section>
      </section>
    </main>
  </div>
</>
  );
}