import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../lib/firebase-admin';
import { verifyToken } from '../../../lib/auth';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

function getCallerRole(cookieHeader: string | null): 'member' | 'admin' | null {
  if (!cookieHeader) return null;
  const jar = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k?.trim() ?? '', v.join('=')];
    }),
  );

  const memberToken = jar['sw_auth'];
  const adminToken = jar['sw_admin'];

  if (adminToken) {
    const payload = verifyToken(adminToken);
    if (payload?.sub === 'admin') return 'admin';
  }
  if (memberToken) {
    const payload = verifyToken(memberToken);
    if (payload?.sub === 'member' || payload?.sub === 'admin') return 'member';
  }
  return null;
}

export async function GET(request: Request) {
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
  const cookieStore = await cookies();
  const memberToken = cookieStore.get('sw_auth')?.value;
  const adminToken = cookieStore.get('sw_admin')?.value;

  const isAuthorized =
    (memberToken && verifyToken(memberToken)) ||
    (adminToken && verifyToken(adminToken));

  if (!isAuthorized) {
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
