'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer aria-label="Site footer" className="footer">
      <div className="footer-content">
        <section aria-labelledby="contact-heading">
          <h3 id="contact-heading">Contact Us</h3>
          <p>
            Email: <a href="mailto:hello@slutwalkdenver.gay">hello@slutwalkdenver.gay</a>
          </p>
        </section>

        <section aria-labelledby="social-heading">
          <h3 id="social-heading">Follow Us</h3>
          <ul className="social-links">
            <li>
              <a href="https://twitter.com/SlutWalkDenver" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://instagram.com/SlutWalkDenver" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://mastodon.social/@SlutWalkDenver" aria-label="Mastodon" target="_blank" rel="noopener noreferrer">
                Mastodon
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="legal-heading">
          <h3 id="legal-heading">Legal</h3>
          <ul className="legal-links">
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/accessibility">Accessibility Statement</Link>
            </li>
          </ul>
        </section>
      </div>

      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} SlutWalk Denver. All rights reserved.</p>
      </div>
    </footer>
  );
}
