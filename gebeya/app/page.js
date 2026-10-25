import Link from 'next/link';
import { load } from '@/lib/db';
import { ITEMS } from '@/lib/constants';
import { summarize } from '@/lib/stats';
import { etb } from '@/lib/format';

export const revalidate = 60; // ISR: identical for everyone, rebuilt at most once a minute

export default async function Home() {
  const { prices } = await load();
  const rows = ITEMS.map((i) => ({ ...i, ...summarize(prices, i.slug) }));
  const hasSample = prices.some((p) => p.sample);
  return (
    <>
      <section className="hero">
        <p className="eyebrow">For students and families</p>
        <h1>Prices keep rising. <em>Know the real cost</em> before you spend.</h1>
        <p className="mut">Gebeya Watch collects market prices from the people who actually pay them, so you can see where teff, oil, sugar and fuel are cheapest, how fast prices are climbing, and whether your allowance will last the month.</p>
        <div className="row center">
          <Link className="btn" href="/budget">Plan my monthly budget</Link>
          <Link className="ghost" href="/my">Report a price</Link>
        </div>
      </section>
      {hasSample && <p className="note center-text">Showing illustrative sample data until real reports come in.</p>}
      <h2>Average prices, last 30 days</h2>
      <div className="grid">
        {rows.map((r) => (
          <article key={r.slug} className="card lift">
            <h3><Link href={`/item/${r.slug}`}>{r.name}</Link></h3>
            {r.current != null ? (
              <>
                <p className="price">{etb(r.current)} <small className="mut">/ {r.unit}</small></p>
                {r.change != null ? (
                  <span className={`badge ${r.change > 0 ? 'up' : 'down'}`}>{r.change > 0 ? '▲' : '▼'} {Math.abs(r.change).toFixed(1)}% vs earlier</span>
                ) : <span className="note">No earlier data to compare</span>}
                <small className="mut">{r.count} reports</small>
              </>
            ) : <p className="empty">No reports yet</p>}
          </article>
        ))}
      </div>
      <h2>How it works</h2>
      <ol className="steps">
        <li><b>Report</b> Share what you paid, in which market and city.</li>
        <li><b>Compare</b> See the cheapest city and the weekly trend.</li>
        <li><b>Plan</b> Test your monthly allowance against today’s prices.</li>
      </ol>
    </>
  );
}
