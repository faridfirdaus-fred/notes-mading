"use client"
import Link from 'next/link';
import Image from 'next/image';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaThumbtack } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NoteCard({ note }) {
  const router = useRouter();
  const [rotation, setRotation] = useState(0);
  
  // Generate consistent rotation angle based on note ID
  useEffect(() => {
    // Use the first character of the note ID to determine rotation
    const idFirstChar = note.id.charAt(0);
    const rotationValue = (parseInt(idFirstChar, 16) % 10) - 5; // Range between -5 and 4
    setRotation(rotationValue);
  }, [note.id]);
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`/api/notes/${note.id}`);
        router.refresh();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };
  
  // Generate consistent paper color based on note ID
  const getPaperColor = () => {
    const colors = [
      'bg-yellow-50', // light yellow
      'bg-blue-50',   // light blue
      'bg-green-50',  // light green
      'bg-pink-50',   // light pink
      'bg-purple-50', // light purple
      'bg-orange-50', // light orange
    ];
    // Use the last character of the note ID to select a color consistently
    const idLastChar = note.id.charAt(note.id.length - 1);
    const colorIndex = parseInt(idLastChar, 16) % colors.length;
    return colors[colorIndex];
  };
  
  const paperColor = getPaperColor();
  
  return (
    <div 
      className={`relative ${paperColor} rounded-sm overflow-hidden transform transition-all duration-200 hover:scale-105 hover:z-10`} 
      style={{ 
        transform: `rotate(${rotation}deg)`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Thumbtack/Pin at the top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10">
        <FaThumbtack size={24} className="text-red-500 drop-shadow-md" />
      </div>
      
      {/* Paper texture effect */}
      <div className="relative p-1 bg-opacity-90" style={{ minHeight: '300px' }}>
        <div className="relative h-48 w-full mb-2">
          <Image
            src={note.imageUrl}
            alt={note.name}
            fill
            className="object-cover rounded shadow-sm"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 font-handwriting">{note.name}</h3>
          <p className="mt-2 text-gray-700 line-clamp-3 font-handwriting">{note.description}</p>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600 italic">
              {new Date(note.createdAt).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})}
            </span>
            
            <div className="flex space-x-2">
              <Link
                href={`/edit/${note.id}`}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <FiEdit />
              </Link>
              
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
