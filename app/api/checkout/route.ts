import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyToken } from '../../../lib/auth';
import { cookies } from 'next/headers';
import { getAdminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

type CartItem = {
  productId: string;
  name: string;
  price: number; // in cents
  quantity: number;
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const memberToken = cookieStore.get('sw_auth')?.value;
  const adminToken = cookieStore.get('sw_admin')?.value;
  const isAuthorized =
    (memberToken && verifyToken(memberToken)) ||
    (adminToken && verifyToken(adminToken));

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  try {
    const body = await request.json() as { items?: unknown };
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 });
    }

    const items = body.items as CartItem[];

    const stripe = new Stripe(stripeKey);
    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price), // price should already be in cents
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
    });

    // Record the pending order in Firestore
    const db = getAdminDb();
    await db.collection('orders').add({
      stripeSessionId: session.id,
      items,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('POST /api/checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
