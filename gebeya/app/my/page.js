import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { load } from '@/lib/db';
import { signOut } from '@/lib/actions';
import { ITEMS } from '@/lib/constants';
import { etb, fmtDate } from '@/lib/format';
import NewPrice from './new';
import DeleteButton from './delete-button';

export const metadata = { title: 'My reports', robots: { index: false } };

export default async function My() {
  const user = await getUser();
  if (!user) redirect('/signin?next=/my'); // Layer 2: verify identity on the server
  const mine = (await load()).prices.filter((p) => p.ownerId === user.id);
  return (
    <>
      <div className="row between">
        <h1>Hello, {user.name}</h1>
        <form action={signOut}><button className="ghost">Sign out</button></form>
      </div>
      <NewPrice />
      <h2>My reports ({mine.length})</h2>
      {mine.length ? (
        <ul className="list">
          {mine.map((p) => {
            const item = ITEMS.find((i) => i.slug === p.item);
            return (
              <li key={p.id} className="card">
                <b><Link href={`/item/${p.item}`}>{item?.name}</Link>: {etb(p.price)} / {item?.unit}</b>
                <small>{p.market}, {p.city} · {fmtDate(p.at)}</small>
                <DeleteButton id={p.id} />
              </li>
            );
          })}
        </ul>
      ) : <p className="empty">You have not reported any prices yet. Use the form above — it takes ten seconds.</p>}
    </>
  );
}
