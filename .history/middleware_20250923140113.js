import { NextResponse } from 'next/server';

export function middleware(request) {
  // Mendapatkan respons
  const response = NextResponse.next();
  
  // Menambahkan header untuk menghindari caching
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Surrogate-Control', 'no-store');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

// Konfigurasi ini menjalankan middleware untuk semua paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. favicon.ico, manifest.json, robots.txt (inside /public)
     */
    '/((?!api|_next|fonts|favicon.ico|manifest.json|robots.txt).*)',
  ],
};