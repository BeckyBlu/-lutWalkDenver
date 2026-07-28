import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../lib/firebase-admin';
import { verifyToken } from '../../../lib/auth';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('sw_admin')?.value;
  if (!adminToken || !verifyToken(adminToken)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ products });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('sw_admin')?.value;
  if (!adminToken || !verifyToken(adminToken)) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json() as {
      name?: unknown;
      description?: unknown;
      price?: unknown;
      imageUrl?: unknown;
      category?: unknown;
      stock?: unknown;
    };

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const price = typeof body.price === 'number' ? body.price : 0;
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : 'other';
    const stock = typeof body.stock === 'number' ? body.stock : 0;

    if (!name || price < 0) {
      return NextResponse.json({ error: 'name and a non-negative price are required' }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection('products').add({
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/products error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
