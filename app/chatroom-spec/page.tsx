import Link from 'next/link';

const goals = [
  'All messages are encrypted before they leave the sender\'s device.',
  'Only intended recipients can decrypt and read messages.',
  'The server stores ciphertext only and never has access to plaintext.',
  'Private encryption keys never leave the user\'s device.',
  'Offline-first behavior remains the default.',
  'Member privacy is prioritized throughout the system.',
];

const protections = [
  'Use modern, audited cryptographic libraries such as Web Crypto, libsodium, or TweetNaCl.',
  'Give each conversation a unique conversation ID, session key, and per-message nonce.',
  'Apply authenticated encryption, signed message metadata, and integrity verification.',
  'Protect text, images, documents, attachments, and file metadata whenever practical.',
];

const flowSteps = [
  'Compose message',
  'Encrypt locally',
  'Digitally sign message',
  'Transmit ciphertext',
  'Server stores ciphertext only',
  'Recipient verifies signature',
  'Recipient decrypts locally',
];

export default function ChatroomSpecPage() {
  return (
    <main className="shell">
      <header className="hero spec-hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/bulletin">Bulletin</Link></li>
            <li><Link href="/calendar">Calendar</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </nav>

        <div className="hero-overlay">
          <p className="eyebrow">Member chatroom</p>
          <h1>Secure End-to-End Encrypted Communication Specification</h1>
          <p>
            This design supports community organizing, mutual aid, event planning, and private discussion
            while keeping message content inaccessible to the server.
          </p>
          <div className="btn-row">
            <Link className="btn" href="/bulletin">Return to bulletin</Link>
          </div>
        </div>
      </header>

      <section className="featured">
        <div className="spec-grid">
          <article className="spec-card">
            <h2>Objective</h2>
            <p>
              Implement a privacy-first, end-to-end encrypted chatroom for SlutWalkDenver.gay that protects
              member discussions while preserving consent, safety, and community trust.
            </p>
          </article>

          <article className="spec-card">
            <h2>Security goals</h2>
            <ul className="spec-list">
              {goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </article>

          <article className="spec-card">
            <h2>End-to-end encryption</h2>
            <ul className="spec-list">
              {protections.map((protection) => (
                <li key={protection}>{protection}</li>
              ))}
            </ul>
          </article>

          <article className="spec-card">
            <h2>Conversation flow</h2>
            <ol className="spec-flow">
              {flowSteps.map((step, index) => (
                <li key={step} className="spec-flow-step">
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </li>
              ))}
            </ol>
          </article>

          <article className="spec-card">
            <h2>Attachments</h2>
            <p>
              All uploaded files are encrypted before upload. This includes images, PDFs, flyers, event
              materials, community artwork, and resource documents whenever practical.
            </p>
          </article>

          <article className="spec-card">
            <h2>Key management</h2>
            <p>
              Each member device generates its own keys, supports device verification and rotation, and
              preserves recovery through encrypted backups and secure import or export workflows.
            </p>
          </article>

          <article className="spec-card">
            <h2>Offline-first design</h2>
            <p>
              Messages can be created and encrypted locally even when the connection is unavailable. They are
              queued for sync and uploaded as ciphertext when connectivity returns.
            </p>
          </article>

          <article className="spec-card">
            <h2>Optional blockchain integration</h2>
            <p>
              Blockchain is not required for messaging. If enabled, it is limited to cryptographic proofs,
              consent records, and moderation hashes, never plaintext chat content or personal data.
            </p>
          </article>

          <article className="spec-card">
            <h2>Consent</h2>
            <p>
              Members receive a clear explanation before any blockchain participation is enabled, including
              what is recorded, whether participation is optional, and how consent can be withdrawn.
            </p>
          </article>

          <article className="spec-card">
            <h2>Member privacy controls</h2>
            <p>
              Members can view encryption status, verify device identity, view consent status, export or
              import keys, rotate encryption keys, delete local history, verify receipts, and disable blockchain
              participation without losing access to encrypted chat.
            </p>
          </article>

          <article className="spec-card">
            <h2>Community safety features</h2>
            <p>
              Administrative tools operate without reading encrypted conversations whenever possible. Public
              moderation and archive management remain available while private encrypted conversations stay
              inaccessible unless a member explicitly shares decrypted content.
            </p>
          </article>

          <article className="spec-card">
            <h2>Security requirements</h2>
            <p>
              The chatroom implements forward secrecy where practical, replay protection, nonce validation,
              authenticated encryption, digital signatures, and secure random number generation.
            </p>
          </article>

          <article className="spec-card">
            <h2>Privacy model</h2>
            <p>
              The system is designed to reduce harm from server compromise, database compromise, network
              interception, and unauthorized third-party access. It does not protect against malware on a
              member device, a compromised recipient device, or intentional sharing of decrypted content.
            </p>
          </article>

          <article className="spec-card">
            <h2>Trust assumptions</h2>
            <p>
              The design trusts client-side cryptography, local secure storage, and verified public keys while
              treating the server, network, and hosting provider as untrusted.
            </p>
          </article>

          <article className="spec-card">
            <h2>Documentation requirements</h2>
            <p>
              Project documentation should clearly explain how end-to-end encryption works, why the server cannot
              read messages, how signatures preserve integrity, and what, if anything, is recorded on the
              blockchain for consent or moderation purposes.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
