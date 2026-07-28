import { NextResponse } from 'next/server';
import { getAdminStorage } from '../../../lib/firebase-admin';
import { getServerSession } from '../../../lib/authz';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file field is required' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 413 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
    }

    const requestedFolder = (formData.get('folder') as string | null) ?? 'bulletin';
    const folder = requestedFolder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+/, '') || 'bulletin';
    const adminOnlyFolders = new Set(['archive', 'community', 'products']);

    if (adminOnlyFolders.has(folder.split('/')[0] ?? '') && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden — admin access required for this upload folder' }, { status: 403 });
    }
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storagePath = `${folder}/${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = getAdminStorage().bucket();
    const fileRef = bucket.file(storagePath);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
      resumable: false,
    });

    // Make the file publicly readable
    await fileRef.makePublic();
    const publicUrl = fileRef.publicUrl();

    return NextResponse.json({ url: publicUrl, path: storagePath }, { status: 201 });
  } catch (err) {
    console.error('POST /api/upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
