import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { load } from './db';

function key() {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET is not set');
  return new TextEncoder().encode(s || 'dev-only-secret-dev-only-secret-123');
}

export async function createSession(uid) {
  const token = await new SignJWT({ uid }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(key());
  (await cookies()).set('s', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
  });
}

export async function endSession() { (await cookies()).delete('s'); }

export async function getUser() {
  const token = (await cookies()).get('s')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    const db = await load();
    return db.users.find((u) => u.id === payload.uid) ?? null;
  } catch { return null; }
}

// Only same-site relative paths are allowed as a post-login destination.
export function safeNext(n) {
  return typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') && !n.includes('\\') ? n : '/my';
}
