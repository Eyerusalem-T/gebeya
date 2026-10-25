'use client'; // Needs interactive state: allowance and quantities.
import { useState } from 'react';
import { etb } from '@/lib/format';

const DEFAULTS = { teff: 10, onion: 3, tomato: 3, sugar: 2, oil: 1, egg: 30, milk: 4, benzene: 0 };

export default function Planner({ items }) {
  const [allowance, setAllowance] = useState(3000);
  const [qty, setQty] = useState(DEFAULTS);
  const q = (i) => qty[i.slug] || 0;
  const now = items.reduce((s, i) => s + (i.price ?? 0) * q(i), 0);
  const before = items.reduce((s, i) => s + (i.before ?? i.price ?? 0) * q(i), 0);
  const left = allowance - now;
  const pct = allowance > 0 ? Math.min(100, (now / allowance) * 100) : 100;
  const num = (v) => Math.max(0, Number(v) || 0);
  return (
    <div className="planner">
      <label className="card">Monthly allowance (ETB)
        <input type="number" min="0" step="50" value={allowance} onChange={(e) => setAllowance(num(e.target.value))} />
      </label>
      <div className="card">
        {items.map((i) => (
          <div className="prow" key={i.slug}>
            <span>{i.name}<br /><small className="mut">{i.price != null ? `${etb(i.price)} / ${i.unit}` : 'no data yet'}</small></span>
            <label className="sr-label">Quantity ({i.unit})
              <input type="number" min="0" value={qty[i.slug] ?? 0} onChange={(e) => setQty({ ...qty, [i.slug]: num(e.target.value) })} />
            </label>
            <b>{etb((i.price ?? 0) * q(i), 0)}</b>
          </div>
        ))}
      </div>
      <section className="card" aria-live="polite">
        <div className="meter"><i style={{ width: `${pct}%`, background: left < 0 ? 'var(--red)' : undefined }} /></div>
        <p><b>Basket cost: {etb(now, 0)}</b> of {etb(allowance, 0)}</p>
        <p className={left < 0 ? 'over' : ''}>{left >= 0 ? `You have ${etb(left, 0)} left for everything else.` : `You are ${etb(-left, 0)} over budget. Try cutting quantities or shopping in a cheaper city.`}</p>
        <p className="note">Price rises have added about {etb(Math.max(0, now - before), 0)} to this basket compared with earlier reports.</p>
      </section>
    </div>
  );
}
