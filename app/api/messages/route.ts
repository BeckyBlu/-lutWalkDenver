import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../lib/firebase-admin';
import { verifyToken } from '../../../lib/auth';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

function isAuthorized(memberToken?: string, adminToken?: string) {
  return (
    (memberToken && verifyToken(memberToken)) ||
    (adminToken && verifyToken(adminToken))
  );
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  if (!isAuthorized(cookieStore.get('sw_auth')?.value, cookieStore.get('sw_admin')?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get('limit') ?? '100');
  const limitN = Math.min(Math.max(1, limitParam), 200);

  try {
    const db = getAdminDb();
    const snap = await db
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .limit(limitN)
      .get();

    const messages = snap.docs.map((doc) => {
      const d = doc.data();
      const ts = d.createdAt;
      const time =
        ts && typeof ts.toDate === 'function'
          ? (ts.toDate() as Date).toLocaleString()
          : new Date().toLocaleString();
      return {
        id: doc.id,
        sender: typeof d.sender === 'string' ? d.sender : 'Member',
        text: typeof d.text === 'string' ? d.text : '',
        time,
      };
    });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error('GET /api/messages error:', err);
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!isAuthorized(cookieStore.get('sw_auth')?.value, cookieStore.get('sw_admin')?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as { text?: unknown; sender?: unknown };
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const sender = typeof body.sender === 'string' ? body.sender.trim() || 'Member' : 'Member';

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection('messages').add({
      sender,
      text,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/messages error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
