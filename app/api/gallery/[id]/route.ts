import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminDb } from '../../../../lib/firebase-admin';
import { verifyToken } from '../../../../lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('sw_admin')?.value;
  if (!adminToken || !verifyToken(adminToken)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  try {
    const db = getAdminDb();
    await db.collection('galleryAssets').doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/gallery/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete gallery asset' }, { status: 500 });
  }
}
