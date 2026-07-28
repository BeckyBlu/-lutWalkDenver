import Link from 'next/link';

export default function ShopSuccessPage() {
  return (
    <main className="shell">
      <section className="featured" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p className="eyebrow">Order confirmed</p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>Thank you for your support! 🌹</h1>
        <p>
          Your order has been placed. You will receive a confirmation email from Stripe.
          Every purchase directly supports SlutWalk Denver organizing and community care.
        </p>
        <div className="btn-row" style={{ marginTop: '2rem' }}>
          <Link className="btn" href="/shop">Continue shopping</Link>
          <Link className="btn btn-secondary" href="/">Return home</Link>
        </div>
      </section>
    </main>
  );
}
