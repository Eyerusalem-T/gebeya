import Link from 'next/link';
export default function NotFound() {
  return <div className="card narrow"><h1>Page not found</h1><p>That page does not exist.</p><Link className="btn" href="/">Go home</Link></div>;
}
