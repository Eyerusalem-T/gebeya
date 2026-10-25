'use client';
import { useActionState, useState } from 'react';
import { addPrice } from '@/lib/actions';
import { ITEMS, CITIES } from '@/lib/constants';

export default function NewPrice() {
  const [state, action, pending] = useActionState(addPrice, null);
  const [slug, setSlug] = useState(ITEMS[0].slug);
  const unit = ITEMS.find((i) => i.slug === slug).unit;
  return (
    <form action={action} className="card">
      <h2>Report a price you paid</h2>
      <div className="two">
        <label>Item<select name="item" value={slug} onChange={(e) => setSlug(e.target.value)}>{ITEMS.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}</select></label>
        <label>City<select name="city">{CITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
      </div>
      <div className="two">
        <label>Market or shop<input name="market" required minLength={2} maxLength={60} placeholder="e.g. Merkato" /></label>
        <label>Price (ETB per {unit})<input name="price" type="number" step="0.01" min="0.01" required inputMode="decimal" /></label>
      </div>
      {state?.error && <p role="alert" className="err">{state.error}</p>}
      {state?.ok && <p role="status" className="ok">Thank you! Your price is now part of the average.</p>}
      <button className="btn" disabled={pending}>{pending ? 'Sending…' : 'Submit price'}</button>
    </form>
  );
}
