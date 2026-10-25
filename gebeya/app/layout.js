import './globals.css';
import Link from 'next/link';

const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(url),
  title: { default: 'Gebeya Watch — know the real price before you spend', template: '%s · Gebeya Watch' },
  description: 'Crowd-sourced market prices across Ethiopian cities, price trends in ETB, and a budget planner for students.',
  openGraph: { title: 'Gebeya Watch', description: 'Real market prices, shared by the people who pay them.', type: 'website' },
};
export const viewport = { themeColor: '#1d4ed8' };

// The layout reads no cookies, so public pages can be statically cached (ISR / SSG).
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <header className="bar">
          <Link href="/" className="logo"><span lang="am">ገበያ</span> Gebeya Watch</Link>
          <nav aria-label="Main">
            <Link href="/">Prices</Link>
            <Link href="/budget">Budget planner</Link>
            <Link href="/my" className="btn small">Report a price</Link>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="foot">Gebeya Watch · prices are reported by users, not official statistics · <Link href="/sitemap.xml">sitemap</Link></footer>
      </body>
    </html>
  );
}
