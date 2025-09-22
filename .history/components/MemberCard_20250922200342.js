'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function MemberCard({ member }) {
  const [rotation, setRotation] = useState(0);
  
  // Generate consistent rotation angle based on member name
  useEffect(() => {
    // Use the first character of the name to determine rotation
    const firstChar = member.name.charAt(0).toLowerCase();
    const charCode = firstChar.charCodeAt(0);
    const rotationValue = ((charCode % 10) - 5) * 0.8; // Range between -4 and 4 (smaller rotation)
    setRotation(rotationValue);
  }, [member.name]);
  
  // Generate consistent paper color based on member name
  const getPaperColor = () => {
    const colors = [
      'bg-yellow-50', // light yellow
      'bg-blue-50',   // light blue
      'bg-green-50',  // light green
      'bg-pink-50',   // light pink
      'bg-purple-50', // light purple
      'bg-orange-50', // light orange
      'bg-emerald-50', // light emerald
      'bg-indigo-50', // light indigo
    ];
    
    // Use the last character of the name to select a color consistently
    const lastChar = member.name.charAt(member.name.length - 1).toLowerCase();
    const charCode = lastChar.charCodeAt(0);
    const colorIndex = charCode % colors.length;
    
    return colors[colorIndex];
  };
  
  const paperColor = getPaperColor();
  
  return (
    <div 
      className={`relative ${paperColor} rounded-md overflow-hidden transform transition-all duration-200 hover:scale-105 hover:z-10 w-72`} 
      style={{ 
        transform: `rotate(${rotation}deg)`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="relative bg-opacity-90 pt-3 pb-3 px-3">
        {/* Photo dengan plester besar di atasnya */}
        <div className="relative h-52 w-52 mx-auto mb-3">
          {/* Plester di atas foto */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 w-24 h-5 bg-gray-300 opacity-90 rounded-sm shadow-sm rotate-0"></div>
          
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