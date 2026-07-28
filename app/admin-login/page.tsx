'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';

const ADMIN_PASSWORD = 'Organizer2026!';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Administrator access is protected by a separate password.');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setMessage('Administrator access unlocked.');
      return;
    }

    setMessage('Incorrect administrator password.');
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
              value={password}
              placeholder="Enter admin password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="submit">Enter admin</button>
          </div>
          <p className="helper">{message}</p>
        </form>
      </section>
    </main>
  );
}
