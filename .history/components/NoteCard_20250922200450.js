"use client"
import Link from 'next/link';
import Image from 'next/image';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
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
      className={`relative ${paperColor} rounded-md overflow-hidden transform transition-all duration-200 hover:scale-105 hover:z-10 w-72`} 
      style={{ 
        transform: `rotate(${rotation}deg)`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Paper texture effect */}
      <div className="relative bg-opacity-90 pt-3 pb-3 px-3">
        {/* Foto dengan plester besar di atasnya */}
        
        <div className="relative h-52 w-52 mx-auto mb-3">
          {/* Plester di atas foto */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 w-24 h-5 bg-gray-300 opacity-90 rounded-sm shadow-sm rotate-0"></div>
          
          <div className="relative h-full w-full border-2 border-gray-100 shadow-sm">
            <Image
              src={note.imageUrl}
              alt={note.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="px-2">
          <h3 className="text-base font-bold text-gray-800 font-handwriting text-center">{note.name}</h3>
          <p className="mt-1 text-gray-700 line-clamp-2 font-handwriting text-center text-sm">{note.description}</p>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-600 italic">
              {new Date(note.createdAt).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})}
            </span>
            
            <div className="flex space-x-1">
              <Link
                href={`/edit/${note.id}`}
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <FiEdit size={16} />
              </Link>
              
              <button
                onClick={handleDelete}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
