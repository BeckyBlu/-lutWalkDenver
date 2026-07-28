import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../../../lib/firebase-admin';
import { requireMemberOrAdmin } from '../../../../../lib/authz';
import { FieldValue } from 'firebase-admin/firestore';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const db = getAdminDb();
    // Use a placeholder member ID since this prototype uses shared passwords
    await db.collection('events').doc(id).update({
      rsvps: FieldValue.arrayUnion('member'),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/events/[id]/rsvp error:', err);
    return NextResponse.json({ error: 'Failed to RSVP' }, { status: 500 });
  }
}
