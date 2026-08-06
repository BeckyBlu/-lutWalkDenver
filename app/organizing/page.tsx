'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrganizingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        const data = await response.json() as { role?: 'member' | 'admin' | null };
        setIsAuthenticated(data.role === 'member' || data.role === 'admin');
      } catch {
        setIsAuthenticated(false);
      }
    }
    void checkAuth();
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="shell">
        <section className="hero" aria-labelledby="page-title">
          <nav aria-label="Breadcrumb">
            <Link href="/">$lutWalk Denver</Link>
            <span aria-hidden="true"> / </span>
            <span>Organizing</span>
          </nav>
          <div className="hero-overlay">
            <p className="eyebrow">Community Organizing</p>
            <h1 id="page-title">Organizing</h1>
            <p>
              This section requires member access. Please log in to view community announcements,
              event planning, volunteer coordination, and mutual aid updates.
            </p>
            <div className="btn-row">
              <Link className="btn" href="/">
                Return to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <nav aria-label="Breadcrumb">
          <Link href="/">$lutWalk Denver</Link>
          <span aria-hidden="true"> / </span>
          <span>Organizing</span>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Community Organizing</p>
          <h1 id="page-title">Organizing</h1>
          <p>
            Community announcements, event planning, volunteer coordination, and mutual aid updates.
          </p>
        </div>
      </section>

      <section className="community-section" aria-labelledby="organizing-areas-title">
        <div className="section-heading">
          <h2 id="organizing-areas-title">Get Involved in Our Collective</h2>
        </div>

        <div className="cards" aria-label="Organizing areas">
          <article className="card">
            <h3>Community Announcements</h3>
            <p>Stay updated with the latest news, decisions, and community-wide communications.</p>
            <Link className="btn btn-secondary" href="/bulletin">
              View Bulletin Board
            </Link>
          </article>
          <article className="card">
            <h3>Event Planning</h3>
            <p>Help organize marches, workshops, fundraisers, and community gatherings.</p>
            <Link className="btn btn-secondary" href="/calendar">
              View Calendar
            </Link>
          </article>
          <article className="card">
            <h3>Volunteer Coordination</h3>
            <p>Sign up for volunteer shifts, find opportunities, and connect with other volunteers.</p>
            <Link className="btn btn-secondary" href="/bulletin">
              Volunteer Sign-Up
            </Link>
          </article>
          <article className="card">
            <h3>Mutual Aid Updates</h3>
            <p>Request and offer mutual aid, share resources, and coordinate support networks.</p>
            <Link className="btn btn-secondary" href="/bulletin">
              Mutual Aid Network
            </Link>
          </article>
        </div>
      </section>

      <section className="featured" aria-labelledby="resources-heading">
        <h2 id="resources-heading">Organizing Resources</h2>
        <div className="notice-grid">
          <article>
            <h3>Meeting Notes</h3>
            <p>Access notes and action items from past organizing meetings.</p>
          </article>
          <article>
            <h3>Contact Lists</h3>
            <p>Connect with organizers, volunteers, and community partners.</p>
          </article>
          <article>
            <h3>Action Toolkits</h3>
            <p>Download guides for organizing events, campaigns, and direct actions.</p>
          </article>
        </div>
      </section>

      <section className="community-board" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading">Upcoming Organizing Efforts</h2>
        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h3>Next General Meeting</h3>
            <p>Date: First Sunday of the month | Time: 4:00 PM | Location: Community Center</p>
          </article>
          <article className="dashboard-card">
            <h3>Volunteer Training</h3>
            <p>Date: Third Wednesday of the month | Time: 6:00 PM | Online</p>
          </article>
          <article className="dashboard-card">
            <h3>Outreach Campaign</h3>
            <p>Ongoing: Distribute flyers, social media, and community partnerships.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
