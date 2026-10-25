import { NextResponse } from 'next/server';
// Layer 1: cheap gate. Layer 2 (page getUser) and Layer 3 (action getUser + owner check) do the real proof.
export function middleware(req) {
  if (!req.cookies.get('s')) {
    const url = new URL('/signin', req.url);
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}
export const config = { matcher: ['/my/:path*'] };
