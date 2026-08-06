import { NextResponse } from 'next/server';
import { FieldValue, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getAdminDb } from '../../../lib/firebase-admin';
import { requireAdmin, requireMemberOrAdmin } from '../../../lib/authz';

type GalleryCollection = 'archive' | 'community';
type GalleryCategory = 'photos' | 'flyers' | 'press' | 'zines' | 'general';
type GalleryAssetRecord = {
  id: string;
  title?: string;
  description?: string;
  collection?: string;
  category?: string;
  imageUrl?: string;
  storagePath?: string;
  createdAt?: unknown;
};

export async function GET(request: Request) {
  if (!(await requireMemberOrAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const collectionFilter = searchParams.get('collection');
  const categoryFilter = searchParams.get('category');
  const limitParam = Number(searchParams.get('limit') ?? '100');
  const limit = Math.min(Math.max(1, limitParam), 200);

  try {
    const db = getAdminDb();
    const snap = await db.collection('galleryAssets').orderBy('createdAt', 'desc').limit(limit).get();

    const assets = snap.docs
      .map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }) as GalleryAssetRecord)
      .filter((asset: GalleryAssetRecord) => {
        if (collectionFilter && asset.collection !== collectionFilter) return false;
        if (categoryFilter && asset.category !== categoryFilter) return false;
        return true;
      });

    return NextResponse.json({ assets });
  } catch (err) {
    console.error('GET /api/gallery error:', err);
    return NextResponse.json({ error: 'Failed to load gallery assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json() as {
      title?: unknown;
      description?: unknown;
      collection?: unknown;
      category?: unknown;
      imageUrl?: unknown;
      storagePath?: unknown;
    };

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const collection = typeof body.collection === 'string' ? body.collection.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : 'general';
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
    const storagePath = typeof body.storagePath === 'string' ? body.storagePath.trim() : '';

    const validCollections: GalleryCollection[] = ['archive', 'community'];
    const validCategories: GalleryCategory[] = ['photos', 'flyers', 'press', 'zines', 'general'];

    if (!title || !imageUrl || !validCollections.includes(collection as GalleryCollection)) {
      return NextResponse.json(
        { error: 'title, imageUrl, and a valid collection are required' },
        { status: 400 },
      );
    }

    if (!validCategories.includes(category as GalleryCategory)) {
      return NextResponse.json({ error: 'invalid category' }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection('galleryAssets').add({
      title,
      description,
      collection,
      category,
      imageUrl,
      storagePath,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/gallery error:', err);
    return NextResponse.json({ error: 'Failed to create gallery asset' }, { status: 500 });
  }
}
