'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { load, save } from './db';
import { ITEMS, CITIES } from './constants';
import { createSession, endSession, getUser, safeNext } from './auth';

export async function signUp(_, fd) {
  const name = String(fd.get('name') || '').trim();
  const email = String(fd.get('email') || '').toLowerCase().trim();
  const pw = String(fd.get('password') || '');
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || pw.length < 8)
    return { error: 'Enter a name, a valid email and a password of 8+ characters.' };
  const db = await load();
  if (db.users.some((u) => u.email === email)) return { error: 'That email is already registered.' };
  const u = { id: randomUUID(), name, email, hash: await bcrypt.hash(pw, 10) };
  db.users.push(u);
  await save(db);
  await createSession(u.id);
  redirect(safeNext(fd.get('next')));
}

export async function signIn(_, fd) {
  const email = String(fd.get('email') || '').toLowerCase().trim();
  const db = await load();
  const u = db.users.find((x) => x.email === email);
  if (!u || !(await bcrypt.compare(String(fd.get('password') || ''), u.hash))) return { error: 'Wrong email or password.' };
  await createSession(u.id);
  redirect(safeNext(fd.get('next')));
}

export async function signOut() { await endSession(); redirect('/'); }

function refresh(slug) {
  revalidatePath('/'); revalidatePath('/budget'); revalidatePath('/my');
  if (slug) revalidatePath(`/item/${slug}`);
}

// Layer 3 of 3: every write re-checks identity inside the action itself.
export async function addPrice(_, fd) {
  const user = await getUser();
  if (!user) return { error: 'Sign in first.' };
  const item = ITEMS.find((i) => i.slug === String(fd.get('item')));
  const city = String(fd.get('city') || '');
  const market = String(fd.get('market') || '').trim();
  const price = Number(fd.get('price'));
  if (!item || !CITIES.includes(city) || market.length < 2 || market.length > 60)
    return { error: 'Pick an item and a city, and enter the market name (2–60 characters).' };
  if (!Number.isFinite(price) || price <= 0 || price > item.max)
    return { error: `Enter a realistic price in ETB (up to ${item.max} per ${item.unit}).` };
  const db = await load();
  db.prices.unshift({ id: randomUUID(), ownerId: user.id, author: user.name, item: item.slug, city, market,
    price: Math.round(price * 100) / 100, at: Date.now() });
  await save(db);
  refresh(item.slug);
  return { ok: true };
}

export async function deletePrice(id) {
  const user = await getUser();
  if (!user) throw new Error('Unauthenticated');
  const db = await load();
  const row = db.prices.find((p) => p.id === id);
  if (!row || row.ownerId !== user.id) throw new Error('Forbidden');
  db.prices = db.prices.filter((p) => p.id !== id);
  await save(db);
  refresh(row.item);
}
