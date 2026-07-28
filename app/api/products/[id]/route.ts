import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../../lib/firebase-admin';
import { requireAdmin } from '../../../../lib/authz';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  try {
    const db = getAdminDb();
    await db.collection('products').doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  try {
    const body = await request.json() as Record<string, unknown>;
    const allowed = ['name', 'description', 'price', 'imageUrl', 'category', 'stock'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }
    const db = getAdminDb();
    await db.collection('products').doc(id).update(updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PATCH /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
