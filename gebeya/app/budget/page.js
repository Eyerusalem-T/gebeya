import { load } from '@/lib/db';
import { ITEMS } from '@/lib/constants';
import { summarize } from '@/lib/stats';
import Planner from './planner';

export const revalidate = 60;
export const metadata = { title: 'Student budget planner', description: 'Check whether your monthly allowance covers your food and fuel basket at current Ethiopian market prices.' };

export default async function Budget() {
  const { prices } = await load();
  const items = ITEMS.map((i) => { const s = summarize(prices, i.slug); return { ...i, price: s.current ?? s.before ?? null, before: s.before }; });
  return (
    <>
      <h1>Student budget planner</h1>
      <p className="mut">Enter your monthly allowance and how much of each item you use. We price your basket with current reported prices and show how much inflation has added.</p>
      <Planner items={items} />
    </>
  );
}
