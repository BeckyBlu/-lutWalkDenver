'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <nav aria-label="Breadcrumb">
          <Link href="/">$lutWalk Denver</Link>
          <span aria-hidden="true"> / </span>
          <span>Terms of Service</span>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Legal</p>
          <h1 id="page-title">Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="community-section" aria-labelledby="terms-heading">
        <div className="section-heading">
          <h2 id="terms-heading">Terms and Conditions</h2>
        </div>

        <article className="card">
          <h3>Welcome to SlutWalk Denver</h3>
          <p>
            These terms and conditions outline the rules and regulations for the use of SlutWalk Denver&apos;s Website,
            located at https://slutwalkdenver.gay.
          </p>
          <p>
            By accessing this website or using our services, we assume you accept these terms and conditions.
            Do not continue to use SlutWalk Denver if you do not agree to take all of the terms and conditions stated on this page.
          </p>
        </article>

        <article className="card">
          <h3>Intellectual Property</h3>
          <p>
            The content on this website, including but not limited to text, graphics, logos, images, and software,
            is the property of SlutWalk Denver and is protected by international copyright laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, transmit, reuse, repost, or use any content from this website
            for public or commercial purposes without our written permission.
          </p>
        </article>

        <article className="card">
          <h3>User Content</h3>
          <p>
            You retain ownership of all content you submit to our platform. By submitting content, you grant us a
            worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and distribute your
            content for the purposes of operating and promoting our services.
          </p>
        </article>

        <article className="card">
          <h3>Prohibited Activities</h3>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul>
            <li>Violating any applicable laws or regulations.</li>
            <li>Infringing on any intellectual property rights.</li>
            <li>Engaging in any conduct that restricts or inhibits anyone&apos;s use of the website.</li>
            <li>Harassing, abusing, or threatening any person.</li>
            <li>Transmitting any viruses, worms, or other harmful code.</li>
            <li>Impersonating any person or entity.</li>
          </ul>
        </article>

        <article className="card">
          <h3>Disclaimer</h3>
          <p>
            The information provided on this website is for general informational purposes only. We make no representations
            or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or
            availability with respect to the website or the information, products, services, or related graphics contained
            on the website for any purpose.
          </p>
        </article>

        <article className="card">
          <h3>Limitation of Liability</h3>
          <p>
            In no event shall SlutWalk Denver, nor its directors, employees, partners, agents, suppliers, or affiliates,
            be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
            loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability
            to use the service.
          </p>
        </article>

        <article className="card">
          <h3>Governing Law</h3>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the State of Colorado,
            United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </article>

        <article className="card">
          <h3>Contact Us</h3>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p>
            <a href="mailto:hello@slutwalkdenver.gay">hello@slutwalkdenver.gay</a>
          </p>
        </article>
      </section>
    </main>
  );
}
