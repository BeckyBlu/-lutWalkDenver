import { cookies } from 'next/headers';
import { verifyToken } from './auth';

export type SessionRole = 'member' | 'admin';
export type Session = { role: SessionRole; claims: Record<string, unknown> } | null;

function tokenHasRole(token: string | undefined, role: SessionRole) {
  if (!token) return null;
  const claims = verifyToken(token);
  if (!claims || claims.sub !== role) return null;
  return { role, claims };
}

export async function getServerSession(): Promise<Session> {
  const cookieStore = await cookies();
  return (
    tokenHasRole(cookieStore.get('sw_admin')?.value, 'admin') ??
    tokenHasRole(cookieStore.get('sw_auth')?.value, 'member')
  );
}

export async function requireMemberOrAdmin() {
  return getServerSession();
}

export async function requireAdmin() {
  const session = await getServerSession();
  return session?.role === 'admin' ? session : null;
}
