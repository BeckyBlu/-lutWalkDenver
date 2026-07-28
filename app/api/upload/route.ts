import { NextResponse } from 'next/server';
import { getAdminStorage } from '../../../lib/firebase-admin';
import { verifyToken } from '../../../lib/auth';
import { cookies } from 'next/headers';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);

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

    const folder = (formData.get('folder') as string | null) ?? 'uploads';
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
