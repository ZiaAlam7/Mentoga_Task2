import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/editor') && pathname !== '/editor/login') {
    const cookie = request.cookies.get('editor_auth');
    if (!cookie?.value) {
      return NextResponse.redirect(new URL('/editor/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/editor/:path*'],
};