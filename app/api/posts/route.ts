import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../lib/firebase-admin';
import { requireMemberOrAdmin } from '../../../lib/authz';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: Request) {
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get('limit') ?? '20');
  const limit = Math.min(Math.max(1, limitParam), 100);

  try {
    const db = getAdminDb();
    const snap = await db
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const posts = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('GET /api/posts error:', err);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as { title?: unknown; text?: unknown };
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const imageUrl = typeof (body as { imageUrl?: unknown }).imageUrl === 'string'
      ? (body as { imageUrl: string }).imageUrl
      : null;

    if (!title || !text) {
      return NextResponse.json({ error: 'title and text are required' }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection('posts').add({
      title,
      text,
      imageUrl,
      pinned: false,
      reactions: {},
      replyCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/posts error:', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
