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
    await db.collection('galleryAssets').doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/gallery/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete gallery asset' }, { status: 500 });
  }
}
