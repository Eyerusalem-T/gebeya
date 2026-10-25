import { notFound } from 'next/navigation';
import Link from 'next/link';
import { load } from '@/lib/db';
import { ITEMS, CITIES } from '@/lib/constants';
import { avg, DAY, summarize, weekly } from '@/lib/stats';
import { etb, fmtDate } from '@/lib/format';
import LineChart from '@/components/line-chart';

export const revalidate = 60;
export const dynamicParams = false; // only the known items exist; anything else is a 404
export const generateStaticParams = () => ITEMS.map((i) => ({ slug: i.slug })); // SSG for every item

const find = (s) => ITEMS.find((i) => i.slug === s);

export async function generateMetadata({ params }) {
  const item = find((await params).slug);
  if (!item) return { title: 'Not found' };
  return { title: `${item.name} price in Ethiopia`,
    description: `Crowd-sourced ${item.name.toLowerCase()} prices in ETB per ${item.unit} across Ethiopian cities, with weekly trend.` };
}

export default async function ItemPage({ params }) {
  const item = find((await params).slug);
  if (!item) notFound();
  const prices = (await load()).prices.filter((p) => p.item === item.slug);
  const s = summarize(prices, item.slug);
  const recent = prices.filter((p) => Date.now() - p.at <= 30 * DAY);
  const pool = recent.length ? recent : prices;
  const byCity = CITIES.map((c) => ({ city: c, avg: avg(pool.filter((p) => p.city === c).map((p) => p.price)) }))
    .filter((x) => x.avg != null).sort((a, b) => a.avg - b.avg);
  const top = Math.max(...byCity.map((x) => x.avg), 1);
  const latest = [...prices].sort((a, b) => b.at - a.at).slice(0, 8);
  const saving = byCity.length > 1 ? ((byCity.at(-1).avg - byCity[0].avg) / byCity.at(-1).avg) * 100 : null;
  return (
    <>
      <p><Link href="/">← All prices</Link></p>
      <h1>{item.name} <small className="mut">per {item.unit}</small></h1>
      {!prices.length ? (
        <p className="empty">No reports for {item.name.toLowerCase()} yet. <Link href="/my">Be the first to report a price.</Link></p>
      ) : (
        <>
          <div className="stats">
            <div className="card"><b>{s.current != null ? etb(s.current) : '—'}</b><span>average, 30 days</span></div>
            <div className="card"><b className={s.change > 0 ? 'up' : 'down'}>{s.change != null ? `${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}%` : '—'}</b><span>vs earlier</span></div>
            <div className="card"><b>{byCity[0] ? byCity[0].city : '—'}</b><span>cheapest city{saving != null ? ` (${saving.toFixed(0)}% below the priciest)` : ''}</span></div>
          </div>
          <h2>Weekly average (ETB)</h2>
          <LineChart points={weekly(prices, item.slug)} label={`Weekly average price of ${item.name} over the last 8 weeks`} />
          <h2>Cheapest cities</h2>
          <ul className="hbars">
            {byCity.map((c) => (<li key={c.city}><span>{c.city}</span><i style={{ width: `${(c.avg / top) * 100}%` }} /><b>{etb(c.avg)}</b></li>))}
          </ul>
          <h2>Latest reports</h2>
          <ul className="list">
            {latest.map((p) => (
              <li key={p.id} className="card"><b>{etb(p.price)} / {item.unit}</b>
                <small>{p.market}, {p.city} · {fmtDate(p.at)} · {p.author}</small></li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
