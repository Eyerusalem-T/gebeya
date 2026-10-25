import { ITEMS } from '@/lib/constants';
const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export default function sitemap() {
  return [{ url: base }, { url: `${base}/budget` }, { url: `${base}/signin` }, ...ITEMS.map((i) => ({ url: `${base}/item/${i.slug}` }))];
}
