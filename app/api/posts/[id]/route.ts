import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../../lib/firebase-admin';
import { requireAdmin, requireMemberOrAdmin } from '../../../../lib/authz';
import { FieldValue } from 'firebase-admin/firestore';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  try {
    const db = getAdminDb();
    await db.collection('posts').doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  try {
    const body = await request.json() as { pinned?: boolean };
    const db = getAdminDb();
    await db.collection('posts').doc(id).update({ pinned: body.pinned ?? false });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PATCH /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  // React handler for emoji reactions: POST /api/posts/[id] { reaction: "👍" }
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = await request.json() as { reaction?: string };
    const reaction = typeof body.reaction === 'string' ? body.reaction : null;
    if (!reaction) {
      return NextResponse.json({ error: 'reaction is required' }, { status: 400 });
    }

    const db = getAdminDb();
    await db.collection('posts').doc(id).update({
      [`reactions.${reaction}`]: FieldValue.increment(1),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 });
  }
}
