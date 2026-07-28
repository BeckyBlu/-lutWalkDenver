import { NextResponse } from 'next/server';
import { getServerSession } from '../../../../lib/authz';

export async function GET() {
  const session = await getServerSession();
  return NextResponse.json({ role: session?.role ?? null });
}
