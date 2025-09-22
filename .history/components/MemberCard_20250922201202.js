'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

// Definisikan pemetaan warna dan rotasi yang konsisten untuk setiap anggota
const memberStyles = {
  'Aar': { color: 'bg-yellow-50', rotation: -2.5 },
  'Fanny': { color: 'bg-pink-50', rotation: 1.8 },
  'Nabil': { color: 'bg-blue-50', rotation: -1.2 },
  'Talitha': { color: 'bg-purple-50', rotation: 3 },
  'default': { color: 'bg-green-50', rotation: 0 }
};

export default function MemberCard({ member }) {
  // Gunakan style spesifik berdasarkan nama anggota, atau default jika tidak ditemukan
  const memberStyle = memberStyles[member.name] || memberStyles.default;
  const paperColor = memberStyle.color;
  const rotation = memberStyle.rotation;
  
  return (
    <div 
      className={`relative ${paperColor} rounded-md transform transition-all duration-200 hover:scale-105 hover:z-10 w-72`} 
      style={{ 
        transform: `rotate(${rotation}deg)`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Plester di kiri dan kanan yang keluar dari card */}
      <div className="absolute top-12 -left-3 z-20 w-12 h-6 bg-gray-300/80 rounded-sm shadow-md transform -rotate-15"></div>
      <div className="absolute top-28 -right-3 z-20 w-10 h-6 bg-gray-300/80 rounded-sm shadow-md transform rotate-15"></div>
      
      {/* Plester di atas card yang benar-benar keluar dari card */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 w-36 h-8 bg-gray-300/90 rounded-sm shadow-md"></div>
      
      <div className="relative bg-opacity-90 pt-3 pb-3 px-3 overflow-hidden">
        {/* Photo dengan margin top lebih besar agar tidak tertutup plester */}
        <div className="relative h-52 w-52 mx-auto mb-3 mt-4">
          {/* Tidak perlu plester kedua di atas foto */}
          
          <div className="relative h-full w-full border-2 border-gray-100 shadow-sm">
            <Image
              src={member.photoUrl || '/placeholder-profile.svg'}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        {/* Information */}
        <div className="px-2">
          <h3 className="text-base font-bold text-gray-800 font-handwriting text-center">{member.name}</h3>
          <p className="mt-1 text-gray-700 font-handwriting text-center text-sm">{member.npm}</p>
          
          {member.role && (
            <div className="mt-2 bg-amber-100 rounded-md p-1 text-center">
              <span className="text-xs text-amber-800 font-medium">{member.role}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}