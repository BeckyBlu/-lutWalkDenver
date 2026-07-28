'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

const ACCESS_PASSWORD = 'GurlGang2030!';

export default function HomePage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(window.localStorage.getItem('slutwalk-access') === 'true');
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === ACCESS_PASSWORD) {
      window.localStorage.setItem('slutwalk-access', 'true');
      setUnlocked(true);
      setPassword('');
      return;
    }

    window.localStorage.removeItem('slutwalk-access');
    setUnlocked(false);
  };

  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>

          <ul>
            <li>About</li>
            <li>Archive</li>
            <li>Events</li>
            <li>Zines</li>
            <li>Community</li>
          </ul>
        </nav>

        <div className="hero-overlay">
          <h1>
            Reclaiming Space.
            Building Community.
            Ending Victim Blaming.
          </h1>

          <p>
            Survivor-led organizing, digital archives, community education, and
            feminist media.
          </p>

          <a className="btn" href="#login">
            Become a Member
          </a>
        </div>
      </header>

      <section id="login" className="login-card">
        <p className="eyebrow">Members only</p>
        <h2>Access the community space</h2>
        <form className="gate-form" onSubmit={handleSubmit}>
          <label htmlFor="password">Access password</label>
          <div className="form-row">
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              placeholder="GurlGang2030!"
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="submit">Enter site</button>
          </div>
          <p className="helper">Demo-only gate for layout purposes.</p>
        </form>
      </section>

      <section className="featured">
        <p className="eyebrow">Featured campaign</p>
        <h2>Center the current call to action here.</h2>
        <p>
          Use this area for a launch announcement, donation push, call for
          volunteers, or the next public event.
        </p>
      </section>

      <section className={`content ${unlocked ? 'content--open' : 'content--locked'}`}>
        <article className="timeline">
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
        </article>

        <section className="zines">
          <article className="zine-card">
            <p className="eyebrow">Zine spotlight</p>
            <h3>Issue 01</h3>
            <p>Feature a cover image, description, and archive details here.</p>
          </article>

          <article className="zine-card">
            <p className="eyebrow">Zine spotlight</p>
            <h3>Issue 02</h3>
            <p>Feature a cover image, description, and archive details here.</p>
          </article>
        </section>

        <section className="events">
          <article>
            <p className="eyebrow">Upcoming event</p>
            <h3>Volunteer meeting</h3>
          </article>

          <article>
            <p className="eyebrow">Upcoming event</p>
            <h3>Community rally</h3>
          </article>
        </section>

        <section className="community-board">
          <article>
            <h3>Announcements</h3>
          </article>

          <article>
            <h3>Discussion</h3>
          </article>

          <article>
            <h3>Resources</h3>
          </article>
        </section>

        <section className="archive">
          <article>
            <h3>Photo archive</h3>
          </article>

          <article>
            <h3>Flyer archive</h3>
          </article>

          <article>
            <h3>Press archive</h3>
          </article>
        </section>
      </section>
    </main>
  );
}