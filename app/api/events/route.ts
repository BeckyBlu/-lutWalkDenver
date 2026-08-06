import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../lib/firebase-admin';
import { requireAdmin, requireMemberOrAdmin } from '../../../lib/authz';
import { FieldValue, type QueryDocumentSnapshot } from 'firebase-admin/firestore';

export async function GET(request: Request) {
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get('limit') ?? '50');
  const limit = Math.min(Math.max(1, limitParam), 100);

  try {
    const db = getAdminDb();
    const snap = await db
      .collection('events')
      .orderBy('date', 'asc')
      .limit(limit)
      .get();

    const events = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ events });
  } catch (err) {
    console.error('GET /api/events error:', err);
    return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json() as {
      title?: unknown;
      date?: unknown;
      time?: unknown;
      location?: unknown;
      description?: unknown;
    };

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const date = typeof body.date === 'string' ? body.date.trim() : '';
    const time = typeof body.time === 'string' ? body.time.trim() : '';
    const location = typeof body.location === 'string' ? body.location.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';

    if (!title || !date) {
      return NextResponse.json({ error: 'title and date are required' }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection('events').add({
      title,
      date,
      time,
      location,
      description,
      rsvps: [],
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/events error:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
