'use client';

import React from 'react';
import { FaThumbtack, FaPaperclip, FaBookmark } from 'react-icons/fa';
import { GiTape } from 'react-icons/gi';

// Komponen ornamen peniti dan stiker untuk mempercantik tampilan mading
export default function BoardDecorations() {
  return (
    <>
      {/* Peniti dekoratif di sudut-sudut */}
      <div className="absolute top-5 left-5 transform -rotate-12">
        <FaThumbtack size={24} className="text-red-500 drop-shadow-md" />
      </div>
      <div className="absolute top-5 right-8 transform rotate-12">
        <FaThumbtack size={24} className="text-blue-500 drop-shadow-md" />
      </div>
      <div className="absolute bottom-5 left-8 transform -rotate-12">
        <FaPaperclip size={30} className="text-gray-400 drop-shadow-md" />
      </div>
      <div className="absolute bottom-5 right-5 transform rotate-12">
        <FaBookmark size={28} className="text-green-500 drop-shadow-md" />
      </div>
      
      {/* Post-it notes dekoratif */}
      <div 
        className="absolute top-12 left-20 bg-yellow-200 w-32 h-24 transform -rotate-6 shadow-md font-handwriting p-2 text-xs text-gray-800"
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%)' }}
      >
        Jangan lupa kerjakan tugas!
      </div>
      
      <div 
        className="absolute bottom-20 right-20 bg-green-100 w-28 h-28 transform rotate-6 shadow-md font-handwriting p-2 text-xs text-gray-800 rounded-full flex items-center justify-center"
      >
        <span className="text-center">Deadline: 25 Sept 2025</span>
      </div>
      
      {/* Selotip efek */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 -rotate-3">
        <GiTape size={60} className="text-gray-300/50" />
      </div>
      
      <div className="absolute top-1/2 right-10 transform rotate-90">
        <GiTape size={60} className="text-gray-300/50" />
      </div>
    </>
  );
}