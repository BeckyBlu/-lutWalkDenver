import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../../../lib/firebase-admin';
import { requireMemberOrAdmin } from '../../../../../lib/authz';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireMemberOrAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const attendee = session.claims?.sub ?? 'member';
  try {
    const body = await request.json() as { status?: unknown };
    const status = typeof body.status === 'string' ? body.status : 'attending';
    const db = getAdminDb();
    await db.collection('events').doc(id).update({
      rsvps: FieldValue.arrayUnion({ attendee, status, at: new Date().toISOString() }),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/events/[id]/rsvp error:', err);
    return NextResponse.json({ error: 'Failed to RSVP' }, { status: 500 });
  }
}
