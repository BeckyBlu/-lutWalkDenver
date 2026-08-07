import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../../lib/firebase-admin';
import { requireAdmin } from '../../../../lib/authz';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  try {
    const db = getAdminDb();
    await db.collection('products').doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json() as Record<string, unknown>;
    const stringFields = ['name', 'description', 'imageUrl', 'category'];
    const numberFields = ['price', 'stock'];
    const updates: Record<string, unknown> = {};
    for (const key of stringFields) {
      if (typeof body[key] === 'string') updates[key] = (body[key] as string).trim();
    }
    for (const key of numberFields) {
      if (typeof body[key] === 'number' && !Number.isNaN(body[key])) {
        updates[key] = body[key];
      }
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    const db = getAdminDb();
    await db.collection('products').doc(id).update(updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PATCH /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
