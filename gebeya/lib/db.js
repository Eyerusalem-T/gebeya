import fs from 'node:fs/promises';
import path from 'node:path';
import seed from '../data/seed.json';

// Local file storage. On your computer the data lives in data/db.json.
// On Vercel the only writable place is /tmp, so data lasts only while the server instance stays alive
// and is wiped when it restarts or you redeploy.
const FILE = process.env.VERCEL ? '/tmp/db.json' : path.join(process.cwd(), 'data', 'db.json');
const shape = (d) => ({ users: d?.users || [], prices: d?.prices || [] });

// Illustrative sample prices, used until the first save creates the real file.
function demo() {
  const now = Date.now();
  return { users: [], prices: seed.prices.map(({ ago, ...p }) => ({ ...p, at: now - ago })) };
}

export async function load() {
  try { return shape(JSON.parse(await fs.readFile(FILE, 'utf8'))); } catch { return demo(); }
}

export async function save(d) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(d));
}
