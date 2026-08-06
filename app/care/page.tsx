'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CarePage() {
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
            <span>Care</span>
          </nav>
          <div className="hero-overlay">
            <p className="eyebrow">Care & Support</p>
            <h1 id="page-title">Care</h1>
            <p>
              This section requires member access. Please log in to view privacy-minded member spaces
              with separate organizer administration.
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
          <span>Care</span>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Care & Support</p>
          <h1 id="page-title">Care</h1>
          <p>
            Privacy-minded member spaces with separate organizer administration for mutual support and well-being.
          </p>
        </div>
      </section>

      <section className="community-section" aria-labelledby="care-areas-title">
        <div className="section-heading">
          <h2 id="care-areas-title">Community Care Network</h2>
        </div>

        <div className="cards" aria-label="Care areas">
          <article className="card">
            <h3>Mutual Aid</h3>
            <p>Request and offer support, share resources, and build solidarity networks within our community.</p>
            <Link className="btn btn-secondary" href="/bulletin">
              Access Mutual Aid
            </Link>
          </article>
          <article className="card">
            <h3>Peer Support</h3>
            <p>Connect with trained peer supporters for confidential listening and emotional support.</p>
            <Link className="btn btn-secondary" href="/chat">
              Join Support Chat
            </Link>
          </article>
          <article className="card">
            <h3>Wellness Resources</h3>
            <p>Access mental health resources, self-care guides, and trauma-informed practices.</p>
            <Link className="btn btn-secondary" href="/community">
              View Resources
            </Link>
          </article>
        </div>
      </section>

      <section className="featured" aria-labelledby="support-heading">
        <h2 id="support-heading">Types of Support Available</h2>
        <div className="notice-grid">
          <article>
            <h3>Emotional Support</h3>
            <p>One-on-one and group support for processing experiences, navigating challenges, and building resilience.</p>
          </article>
          <article>
            <h3>Practical Support</h3>
            <p>Assistance with housing, food, transportation, legal navigation, and other material needs.</p>
          </article>
          <article>
            <h3>Advocacy Support</h3>
            <p>Support for navigating systems, accessing services, and advocating for your rights.</p>
          </article>
        </div>
      </section>

      <section className="community-board" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacy & Confidentiality</h2>
        <p>
          Your privacy is our priority. All care spaces are designed with confidentiality and safety in mind.
        </p>
        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h3>Anonymous Requests</h3>
            <p>Submit requests for support without revealing your identity when needed.</p>
          </article>
          <article className="dashboard-card">
            <h3>Secure Communication</h3>
            <p>All communications in care spaces are encrypted and protected from external access.</p>
          </article>
          <article className="dashboard-card">
            <h3>Consent-Based Sharing</h3>
            <p>Information is only shared with your explicit consent and on a need-to-know basis.</p>
          </article>
        </div>
      </section>

      <section className="events" aria-labelledby="workshops-heading">
        <h2 id="workshops-heading">Upcoming Care Workshops</h2>
        <div className="events">
          <article>
            <p className="eyebrow">Workshop</p>
            <h3>Self-Care for Activists</h3>
            <p>Date: Second Tuesday of the month | Time: 6:00 PM | Location: Online</p>
            <p>Tools and practices for sustaining your activism while caring for yourself.</p>
          </article>
          <article>
            <p className="eyebrow">Workshop</p>
            <h3>Boundary Setting</h3>
            <p>Date: Fourth Thursday of the month | Time: 7:00 PM | Location: Community Center</p>
            <p>Learn to set and maintain healthy boundaries in your personal and activist life.</p>
          </article>
          <article>
            <p className="eyebrow">Support Group</p>
            <h3>Survivor Circle</h3>
            <p>Date: Every Monday | Time: 5:00 PM | Location: Online</p>
            <p>A safe space for survivors to share, listen, and heal together.</p>
          </article>
        </div>
      </section>

      <section className="archive" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading">Community Testimonials</h2>
        <div className="archive">
          <article>
            <h3>"This space saved my life"</h3>
            <p>Finding this community gave me the support I needed to heal and the strength to keep fighting for justice.</p>
            <p className="muted">- Anonymous member</p>
          </article>
          <article>
            <h3>"I found my voice here"</h3>
            <p>Through the care and support of this collective, I learned to speak my truth and demand the respect I deserve.</p>
            <p className="muted">- Anonymous member</p>
          </article>
          <article>
            <h3>"We take care of each other"</h3>
            <p>The mutual aid network ensured I had what I needed when I had nowhere else to turn. This is what community looks like.</p>
            <p className="muted">- Anonymous member</p>
          </article>
        </div>
      </section>
    </main>
  );
}
