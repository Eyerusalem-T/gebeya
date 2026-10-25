'use client';
import { useTransition } from 'react';
import { deletePrice } from '@/lib/actions';

export default function DeleteButton({ id }) {
  const [pending, start] = useTransition();
  return <button className="ghost" disabled={pending} onClick={() => { if (confirm('Delete this report?')) start(() => deletePrice(id)); }}>{pending ? 'Deleting…' : 'Delete'}</button>;
}
