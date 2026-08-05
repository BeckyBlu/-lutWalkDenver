'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <nav aria-label="Breadcrumb">
          <Link href="/">$lutWalk Denver</Link>
          <span aria-hidden="true"> / </span>
          <span>Privacy Policy</span>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Legal</p>
          <h1 id="page-title">Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="community-section" aria-labelledby="privacy-heading">
        <div className="section-heading">
          <h2 id="privacy-heading">Our Commitment to Your Privacy</h2>
        </div>

        <article className="card">
          <h3>Introduction</h3>
          <p>
            Welcome to SlutWalk Denver. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>
        </article>

        <article className="card">
          <h3>Data We Collect</h3>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
          </ul>
        </article>

        <article className="card">
          <h3>How We Use Your Data</h3>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>
        </article>

        <article className="card">
          <h3>Data Security</h3>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
            used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal
            data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
        </article>

        <article className="card">
          <h3>Your Legal Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Request access</strong> to your personal data.</li>
            <li><strong>Request correction</strong> of the personal data that we hold about you.</li>
            <li><strong>Request erasure</strong> of your personal data.</li>
            <li><strong>Object to processing</strong> of your personal data.</li>
            <li><strong>Request restriction of processing</strong> your personal data.</li>
            <li><strong>Request transfer</strong> of your personal data.</li>
            <li><strong>Withdraw consent</strong> at any time where we are relying on consent to process your personal data.</li>
          </ul>
        </article>

        <article className="card">
          <h3>Contact Us</h3>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p>
            <a href="mailto:hello@slutwalkdenver.gay">hello@slutwalkdenver.gay</a>
          </p>
        </article>
      </section>
    </main>
  );
}
