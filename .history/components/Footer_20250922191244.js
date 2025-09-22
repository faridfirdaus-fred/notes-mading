'use client';

import { FaHeart, FaCode, FaCoffee } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 flex items-center gap-1">
              <span>Dibuat dengan</span> 
              <FaHeart className="text-red-500 inline-block mx-1" /> 
              <span>dan</span> 
              <FaCoffee className="text-amber-700 inline-block mx-1" /> 
              <span>oleh</span> 
              <span className="font-semibold">Tim Mading Notes</span>
            </p>
          </div>
          
          <div className="flex items-center">
            {/* Decorative sticky note in footer */}
            <div 
              className="relative p-3 bg-yellow-200 shadow-md mr-4 transform rotate-2 text-xs"
              style={{ 
                width: '90px',
                height: '90px',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-gray-300"></div>
              <p className="font-handwriting text-center mt-2">
                Terima kasih sudah berkunjung!
              </p>
            </div>
            
            <div className="text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Notes Mading</p>
              <p className="flex items-center">
                <FaCode className="mr-1" /> 
                <span>Made with Next.js & MongoDB</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}