'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaThumbtack, FaPaperclip, FaMapPin } from 'react-icons/fa';
import { BsStickiesFill, BsPushpin } from 'react-icons/bs';
import { GiNotePad } from 'react-icons/gi';

export default function BoardDecorations() {
  // Generate random positions for decorative elements
  const [decorations, setDecorations] = useState([]);
  
  useEffect(() => {
    // Generate random decorations
    const generateDecorations = () => {
      const items = [];
      
      // Pins
      for (let i = 0; i < 7; i++) {
        items.push({
          id: `pin-${i}`,
          type: 'pin',
          top: `${Math.random() * 80 + 5}%`,
          left: `${Math.random() * 90 + 5}%`,
          rotation: Math.random() * 360,
          color: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'][Math.floor(Math.random() * 6)],
          size: Math.random() * 10 + 12
        });
      }
      
      // Paperclips
      for (let i = 0; i < 4; i++) {
        items.push({
          id: `paperclip-${i}`,
          type: 'paperclip',
          top: `${Math.random() * 80 + 5}%`,
          left: `${Math.random() * 90 + 5}%`,
          rotation: Math.random() * 90 - 45,
          size: Math.random() * 8 + 16
        });
      }
      
      // Sticky notes (small)
      for (let i = 0; i < 4; i++) {
        items.push({
          id: `sticky-${i}`,
          type: 'sticky',
          top: `${Math.random() * 80 + 5}%`,
          left: `${Math.random() * 90 + 5}%`,
          rotation: Math.random() * 30 - 15,
          color: ['#f6e05e', '#9ae6b4', '#90cdf4', '#e9d8fd'][i % 4],
          size: Math.random() * 20 + 25,
          content: ['TODO', 'IDEA', 'NOTE', '!'][i % 4]
        });
      }
      
      return items;
    };
    
    setDecorations(generateDecorations());
  }, []);
  
  // Render the decoration based on type
  const renderDecoration = (item) => {
    switch (item.type) {
      case 'pin':
        return (
          <div 
            key={item.id}
            className="absolute z-10 opacity-80" 
            style={{ 
              top: item.top, 
              left: item.left, 
              transform: `rotate(${item.rotation}deg)`,
              pointerEvents: 'none'
            }}
          >
            <FaThumbtack 
              size={item.size} 
              className={`text-${item.color}-500 drop-shadow-md`} 
            />
          </div>
        );
        
      case 'paperclip':
        return (
          <div 
            key={item.id}
            className="absolute z-10 opacity-80" 
            style={{ 
              top: item.top, 
              left: item.left, 
              transform: `rotate(${item.rotation}deg)`,
              pointerEvents: 'none'
            }}
          >
            <FaPaperclip 
              size={item.size} 
              className="text-gray-400 drop-shadow-sm" 
            />
          </div>
        );
        
      case 'sticky':
        return (
          <div 
            key={item.id}
            className="absolute z-10 flex items-center justify-center opacity-90 shadow-sm" 
            style={{ 
              top: item.top, 
              left: item.left, 
              transform: `rotate(${item.rotation}deg)`,
              background: item.color,
              width: `${item.size}px`,
              height: `${item.size}px`,
              pointerEvents: 'none'
            }}
          >
            <span className="text-xs font-bold" style={{ fontSize: `${item.size / 4}px` }}>
              {item.content}
            </span>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="board-decorations">
      {decorations.map(item => renderDecoration(item))}
    </div>
  );
}
