'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="bg-amber-700 text-white">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-handwriting font-bold hover:text-amber-200 transition-colors">
          Notes Mading
        </Link>
        
        <nav className="order-3 md:order-2 w-full md:w-auto mt-2 md:mt-0">
          <ul className="flex justify-center space-x-4 md:space-x-6">
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
          <div className="order-2 md:order-3">
            <Link 
              href="/create"
              className="bg-amber-600 hover:bg-amber-500 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
              aria-label="Add New Note"
            >
              <span className="hidden sm:inline">Add New Note</span>
              <span className="sm:hidden">+ Note</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}