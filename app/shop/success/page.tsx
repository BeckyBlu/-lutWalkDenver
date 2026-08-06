import Link from 'next/link';

export default function ShopSuccessPage() {
  return (
    <main className="shell">
      <section className="featured" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p className="eyebrow">Thank you</p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>Your donation supports the community.</h1>
        <p>
          Thank you for donating to Rouge Support Network. Every contribution directly supports
          survivor care and SlutWalk Denver organizing.
        </p>
        <div className="btn-row" style={{ marginTop: '2rem' }}>
          <Link className="btn" href="/zines">Back to Zines</Link>
          <Link className="btn btn-secondary" href="/">Return home</Link>
        </div>
      </section>
    </main>
  );
}
