import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../../../lib/firebase-admin';
import { requireMemberOrAdmin } from '../../../../../lib/authz';
import { FieldValue, type QueryDocumentSnapshot } from 'firebase-admin/firestore';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = await request.json() as { text?: unknown };
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const db = getAdminDb();
    const replyRef = await db
      .collection('posts')
      .doc(id)
      .collection('replies')
      .add({ text, createdAt: FieldValue.serverTimestamp() });

    // Increment replyCount on the parent post
    await db.collection('posts').doc(id).update({
      replyCount: FieldValue.increment(1),
    });

    return NextResponse.json({ id: replyRef.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/posts/[id]/replies error:', err);
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}

export async function GET(_request: Request, context: RouteContext) {
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const db = getAdminDb();
    const snap = await db
      .collection('posts')
      .doc(id)
      .collection('replies')
      .orderBy('createdAt', 'asc')
      .get();

    const replies = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ replies });
  } catch (err) {
    console.error('GET /api/posts/[id]/replies error:', err);
    return NextResponse.json({ error: 'Failed to load replies' }, { status: 500 });
  }
}
