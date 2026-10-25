// Regenerates data/seed.json: illustrative SAMPLE prices (not real data). Run: npm run seed
import fs from 'node:fs'; import path from 'node:path';
let a = 42;
const rnd = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const base = { teff: 120, onion: 60, tomato: 50, sugar: 130, oil: 260, egg: 12, milk: 90, benzene: 125 };
const trend = { teff: 0.012, onion: 0.008, tomato: 0.006, sugar: 0.014, oil: 0.016, egg: 0.01, milk: 0.01, benzene: 0.006 };
const cities = { 'Addis Ababa': 1, Adama: 0.96, 'Bahir Dar': 0.94, 'Dire Dawa': 1.05, Gondar: 0.97, Hawassa: 0.93, Jimma: 0.95, Mekelle: 1.07 };
const DAY = 864e5;
const prices = [];
for (let w = 0; w < 12; w++)
  for (const [item, b] of Object.entries(base))
    for (const [city, f] of Object.entries(cities)) {
      const price = b * (1 + trend[item] * (11 - w)) * f * (1 + (rnd() - 0.5) * 0.08);
      prices.push({ id: `sample-${item}-${city}-${w}`.replace(/\s/g, ''), ownerId: 'sample', author: 'Sample data', item, city,
        market: 'Central market', price: Math.round(price * 100) / 100, ago: (w * 7 + Math.floor(rnd() * 6)) * DAY, sample: true });
    }
fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'data', 'seed.json'), JSON.stringify({ prices }));
console.log(`Wrote ${prices.length} sample prices to data/seed.json`);
