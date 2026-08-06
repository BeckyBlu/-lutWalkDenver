'use client';

import Link from 'next/link';

export default function AccessibilityPage() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <nav aria-label="Breadcrumb">
          <Link href="/">$lutWalk Denver</Link>
          <span aria-hidden="true"> / </span>
          <span>Accessibility Statement</span>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Accessibility</p>
          <h1 id="page-title">Accessibility Statement</h1>
          <p>Our commitment to inclusive access for all users.</p>
        </div>
      </section>

      <section className="community-section" aria-labelledby="accessibility-heading">
        <div className="section-heading">
          <h2 id="accessibility-heading">Our Accessibility Commitment</h2>
        </div>

        <article className="card">
          <h3>Our Mission</h3>
          <p>
            At SlutWalk Denver, we are committed to ensuring digital accessibility for people with disabilities.
            We are continually improving the user experience for everyone and applying the relevant accessibility
            standards to ensure our website is accessible to the widest possible audience.
          </p>
        </article>

        <article className="card">
          <h3>Web Content Accessibility Guidelines (WCAG)</h3>
          <p>
            We aim to support the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA. These guidelines explain
            how to make web content more accessible for people with disabilities and more user-friendly for everyone.
          </p>
          <p>
            The guidelines have three levels of accessibility (A, AA, and AAA). We&apos;ve chosen Level AA as the target
            for our website and are working towards full compliance.
          </p>
        </article>

        <article className="card">
          <h3>Accessibility Features</h3>
          <p>Our website includes the following accessibility features:</p>
          <ul>
            <li><strong>Keyboard Navigation</strong> - All functionality is available through keyboard interface.</li>
            <li><strong>Screen Reader Compatibility</strong> - We use semantic HTML and ARIA attributes for screen reader users.</li>
            <li><strong>Color Contrast</strong> - We maintain sufficient color contrast for text readability.</li>
            <li><strong>Alternative Text</strong> - Images have appropriate alt text for context.</li>
            <li><strong>Responsive Design</strong> - Our site adapts to different screen sizes and devices.</li>
            <li><strong>Reduced Motion</strong> - We respect the prefers-reduced-motion media query.</li>
            <li><strong>Skip Links</strong> - We provide skip to main content links for keyboard users.</li>
          </ul>
        </article>

        <article className="card">
          <h3>Browser and Assistive Technology Compatibility</h3>
          <p>
            We aim to support the following browsers and assistive technologies:
          </p>
          <ul>
            <li>Chrome (latest 2 versions)</li>
            <li>Firefox (latest 2 versions)</li>
            <li>Safari (latest 2 versions)</li>
            <li>Edge (latest 2 versions)</li>
            <li>JAWS screen reader</li>
            <li>NVDA screen reader</li>
            <li>VoiceOver (macOS/iOS)</li>
            <li>TalkBack (Android)</li>
          </ul>
        </article>

        <article className="card">
          <h3>Known Limitations</h3>
          <p>
            Despite our best efforts to ensure accessibility, there may be some limitations. Below is a description of known
            limitations, and potential solutions. Please contact us if you observe an issue not listed below.
          </p>
          <p>
            <strong>Known issue:</strong> Some older PDF documents may not be fully accessible.<br />
            <strong>Solution:</strong> We are working to remediate these documents or provide accessible alternatives.
          </p>
        </article>

        <article className="card">
          <h3>Feedback and Contact Information</h3>
          <p>
            We welcome your feedback on the accessibility of SlutWalk Denver. Please let us know if you encounter
            accessibility barriers:
          </p>
          <ul>
            <li><strong>E-mail:</strong> <a href="mailto:accessibility@slutwalkdenver.gay">accessibility@slutwalkdenver.gay</a></li>
            <li><strong>Phone:</strong> [Phone number if available]</li>
            <li><strong>Mailing Address:</strong> [Mailing address if available]</li>
          </ul>
          <p>
            We try to respond to feedback within 3-5 business days.
          </p>
        </article>

        <article className="card">
          <h3>Formal Complaints</h3>
          <p>
            If you wish to file a formal complaint regarding accessibility, please contact us using the information above.
            We will investigate your complaint and take appropriate action to address any accessibility issues.
          </p>
        </article>

        <article className="card">
          <h3>Accessibility Resources</h3>
          <p>
            For more information about web accessibility and standards, please visit:
          </p>
          <ul>
            <li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer">WCAG Guidelines</a></li>
            <li><a href="https://www.access-board.gov/" target="_blank" rel="noopener noreferrer">U.S. Access Board</a></li>
            <li><a href="https://www.ada.gov/" target="_blank" rel="noopener noreferrer">ADA National Network</a></li>
          </ul>
        </article>
      </section>
    </main>
  );
}
