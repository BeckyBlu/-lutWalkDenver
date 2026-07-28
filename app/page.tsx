'use client';

import { useEffect, useState } from 'react';

const ACCESS_PASSWORD = 'GurlGang2030!';

const boards = [
  'Welcome thread for new members',
  'Volunteer sign-up and planning',
  'Photo post from the latest meetup',
];

const storeItems = [
  'Event tee',
  'Archived zine #04',
  'Sticker pack',
];

export default function HomePage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(window.localStorage.getItem('slutwalk-access') === 'true');
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
      <section className="gate-card">
        <div>
          <p className="eyebrow">Members only</p>
          <h1>SlutWalk Denver Community Access</h1>
          <p className="lede">
            Enter with the shared password to reach the members-only space for
            conversation, planning, events, and store access.
          </p>
        </div>

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
          <p className="helper">Demo-only gate for the starter scaffold.</p>
        </form>
      </section>

      <section className={`content ${unlocked ? 'content--open' : 'content--locked'}`}>
        <article className="feature-card">
          <p className="eyebrow">Featured announcement</p>
          <h2>Build a homepage that can grow into a community hub.</h2>
          <p>
            Swap this copy, add photography, and connect the cards below to real
            content sources when you are ready.
          </p>
        </article>

        <div className="grid">
          <article className="panel">
            <p className="eyebrow">Latest board activity</p>
            <ul>
              {boards.map((board) => (
                <li key={board}>{board}</li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <p className="eyebrow">Upcoming events</p>
            <div className="mock-box">Calendar embed placeholder</div>
          </article>

          <article className="panel panel--wide">
            <p className="eyebrow">Featured merch and zines</p>
            <div className="store-grid">
              {storeItems.map((item) => (
                <div className="product" key={item}>
                  <div className="mock-box">Image</div>
                  <h3>{item}</h3>
                  <p>Use this block for price, stock, and short product copy.</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}