'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="bg-amber-700 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-handwriting font-bold hover:text-amber-200 transition-colors">
          Notes Mading
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/" 
                className={`hover:text-amber-200 transition-colors ${pathname === '/' ? 'font-bold border-b-2 border-amber-200' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/team" 
                className={`hover:text-amber-200 transition-colors ${pathname === '/team' ? 'font-bold border-b-2 border-amber-200' : ''}`}
              >
                Our Team
              </Link>
            </li>
          </ul>
        </nav>
        
        {pathname === '/' && (
          <Link 
            href="/create"
            className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Add New Note
          </Link>
        )}
      </div>
    </header>
  );
}