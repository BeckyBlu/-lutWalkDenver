import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../../../lib/firebase-admin';
import { requireMemberOrAdmin } from '../../../../../lib/authz';
import { FieldValue, type QueryDocumentSnapshot } from 'firebase-admin/firestore';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const db = getAdminDb();
    const snap = await db.collection('posts').doc(id).collection('replies').orderBy('createdAt', 'asc').get();
    const replies = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ replies });
  } catch (err) {
    console.error('GET /api/posts/[id]/replies error:', err);
    return NextResponse.json({ error: 'Failed to load replies' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await request.json() as { text?: unknown; sender?: unknown };
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const sender = typeof body.sender === 'string' ? body.sender.trim() || 'Member' : 'Member';
    if (!text) return NextResponse.json({ error: 'text is required' }, { status: 400 });
    const db = getAdminDb();
    const ref = await db.collection('posts').doc(id).collection('replies').add({
      text, sender, createdAt: FieldValue.serverTimestamp(),
    });
    await db.collection('posts').doc(id).update({ replyCount: FieldValue.increment(1) });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/posts/[id]/replies error:', err);
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}
