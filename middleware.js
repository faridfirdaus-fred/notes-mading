import { NextResponse } from 'next/server';

export function middleware(request) {
  // Cek apakah ini adalah request yang memerlukan refresh
  const refreshParam = request.nextUrl.searchParams.get('refresh');
  
  // Buat URL baru tanpa parameter refresh
  if (refreshParam) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('refresh');
    return NextResponse.redirect(url);
  }
  
  // Mendapatkan respons
  const response = NextResponse.next();
  
  // Menambahkan header untuk menghindari caching
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('Surrogate-Control', 'no-store');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
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