'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function EducationPage() {
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
            <span>Education</span>
          </nav>
          <div className="hero-overlay">
            <p className="eyebrow">Education & Resources</p>
            <h1 id="page-title">Education</h1>
            <p>
              This section requires member access. Please log in to view zines, archive materials,
              public resources, and shared history from the collective.
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
          <span>Education</span>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Education & Resources</p>
          <h1 id="page-title">Education</h1>
          <p>
            Zines, archive materials, public resources, and shared history from the collective.
          </p>
        </div>
      </section>

      <section className="community-section" aria-labelledby="education-areas-title">
        <div className="section-heading">
          <h2 id="education-areas-title">Learn, Share, and Preserve</h2>
        </div>

        <div className="cards" aria-label="Education areas">
          <article className="card">
            <h3>Zines</h3>
            <p>Self-published magazines featuring stories, art, and analysis from our community.</p>
            <Link className="btn btn-secondary" href="/zines">
              Browse Zines
            </Link>
          </article>
          <article className="card">
            <h3>Archive Materials</h3>
            <p>Historical documents, flyers, photos, and media from past actions and events.</p>
            <Link className="btn btn-secondary" href="/archive">
              Explore Archive
            </Link>
          </article>
          <article className="card">
            <h3>Public Resources</h3>
            <p>Educational materials, toolkits, and guides for community organizing and advocacy.</p>
            <Link className="btn btn-secondary" href="/community">
              View Resources
            </Link>
          </article>
        </div>
      </section>

      <section className="featured" aria-labelledby="history-heading">
        <h2 id="history-heading">Shared History</h2>
        <p>
          Our collective history is a testament to the power of community organizing and mutual aid.
          Explore the timeline of our movement and the stories that have shaped us.
        </p>
        <div className="timeline" role="list">
          <article role="listitem">
            <h2>2011</h2>
            <p>First Denver SlutWalk - The movement begins with a march against victim-blaming and for bodily autonomy.</p>
          </article>
          <article role="listitem">
            <h2>2015</h2>
            <p>Expansion of educational programs - Workshops on consent, sex worker rights, and intersectional feminism.</p>
          </article>
          <article role="listitem">
            <h2>2020</h2>
            <p>Digital organizing - Transition to online events and virtual community building during the pandemic.</p>
          </article>
          <article role="listitem">
            <h2>2022</h2>
            <p>Archive project launch - Preserving our history through digital archives and oral histories.</p>
          </article>
          <article role="listitem">
            <h2>2024</h2>
            <p>Community hub platform - Launch of this platform for centralized organizing and resource sharing.</p>
          </article>
        </div>
      </section>

      <section className="zines" aria-labelledby="zine-spotlight-heading">
        <h2 id="zine-spotlight-heading">Zine Spotlight</h2>
        <div className="zines">
          <article className="zine-card">
            <p className="eyebrow">Featured</p>
            <h3>Bodily Autonomy Manifesto</h3>
            <p>A collection of essays and artwork exploring the intersections of consent, autonomy, and justice.</p>
            <Link className="btn btn-secondary" href="/zines">
              Read Now
            </Link>
          </article>
          <article className="zine-card">
            <p className="eyebrow">New Release</p>
            <h3>Survivor Solidarity Guide</h3>
            <p>Practical tools and resources for supporting survivors and building trauma-informed communities.</p>
            <Link className="btn btn-secondary" href="/zines">
              Read Now
            </Link>
          </article>
        </div>
      </section>

      <section className="community-board" aria-labelledby="learning-heading">
        <h2 id="learning-heading">Learning Resources</h2>
        <div className="notice-grid">
          <article>
            <h3>Reading List</h3>
            <p>Curated list of books, articles, and essays on sex worker rights, feminism, and social justice.</p>
          </article>
          <article>
            <h3>Workshop Materials</h3>
            <p>Slides, handouts, and recordings from past workshops and training sessions.</p>
          </article>
          <article>
            <h3>Glossary</h3>
            <p>Definitions of key terms and concepts related to our movement and community.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
