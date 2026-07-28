'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { GateModel } from '../gate-model';
import { initialGateModel } from '../gate-model';

const ADMIN_PASSWORD = 'Organizer2026!';
const ADMIN_ACCESS_KEY = 'slutwalk-admin-access';

export default function AdminLoginPage() {
  const [gateModel, setGateModel] = useState<GateModel>(initialGateModel);
  const [message, setMessage] = useState('Administrator access is protected by a separate password.');
  const [unlocked, setUnlocked] = useState(false);
  const [notes, setNotes] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  useEffect(() => {
    const isUnlocked = window.localStorage.getItem(ADMIN_ACCESS_KEY) === 'true';
    setUnlocked(isUnlocked);
    if (isUnlocked) {
      setMessage('Administrator access unlocked.');
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (gateModel.password === ADMIN_PASSWORD) {
      window.localStorage.setItem(ADMIN_ACCESS_KEY, 'true');
      setUnlocked(true);
      setMessage('Administrator access unlocked.');
      return;
    }

    window.localStorage.removeItem(ADMIN_ACCESS_KEY);
    setUnlocked(false);
    setMessage('Incorrect administrator password.');
  };

  const handleLogout = () => {
    window.localStorage.removeItem(ADMIN_ACCESS_KEY);
    setUnlocked(false);
    setGateModel(initialGateModel);
    setMessage('Administrator access is protected by a separate password.');
  };

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
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Administrator portal</p>
          <h1>Moderation, management, and archive control.</h1>
          <p>Separate administrator access for content moderation, event management, and archive uploads.</p>
        </div>
      </header>

      <section className="login-card">
        <h2>Administrator login</h2>
        <form className="gate-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-password">Administrator password</label>
          <div className="form-row">
            <input
              id="admin-password"
              name="admin-password"
              type="password"
              value={gateModel.password}
              placeholder="Enter admin password"
              onChange={(event) => setGateModel({ ...gateModel, password: event.target.value })}
            />
            <button type="submit">Enter admin</button>
          </div>
          <p className="helper">{message}</p>
        </form>
      </section>

      <section className={`content ${unlocked ? 'content--open' : 'content--locked'}`}>
        <div className="btn-row" style={{ justifyContent: 'flex-start' }}>
          <button className="btn btn-secondary" type="button" onClick={handleLogout}>
            Lock admin session
          </button>
        </div>

        <div className="notice-grid">
          <article>
            <h3>Data editor</h3>
            <label htmlFor="admin-notes">Draft notes</label>
            <textarea
              id="admin-notes"
              rows={6}
              placeholder="Write internal notes or updates..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
            <button type="button">Save draft</button>
          </article>

          <article>
            <h3>Calendar editor</h3>
            <label htmlFor="admin-event-title">Event title</label>
            <input
              id="admin-event-title"
              type="text"
              placeholder="Volunteer orientation"
              value={eventTitle}
              onChange={(event) => setEventTitle(event.target.value)}
            />
            <label htmlFor="admin-event-time">Event time</label>
            <input
              id="admin-event-time"
              type="text"
              placeholder="Sunday • 4:00 PM"
              value={eventTime}
              onChange={(event) => setEventTime(event.target.value)}
            />
            <label htmlFor="admin-event-notes">Event notes</label>
            <textarea
              id="admin-event-notes"
              rows={6}
              placeholder="Add description or reminders..."
              value={eventNotes}
              onChange={(event) => setEventNotes(event.target.value)}
            />
            <button type="button">Preview update</button>
          </article>
        </div>
      </section>
    </main>
  );
}
