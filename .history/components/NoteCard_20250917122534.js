"use client"
import Link from 'next/link';
import Image from 'next/image';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function NoteCard({ note }) {
  const router = useRouter();
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`/api/notes/${note.id}`); // Gunakan note.id bukan note._id
        router.refresh();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={note.imageUrl}
          alt={note.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{note.name}</h3>
        <p className="mt-2 text-gray-600 line-clamp-3">{note.description}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
          
          <div className="flex space-x-2">
            <Link
              href={`/edit/${note._id}`}
              className="p-2 text-blue-500 hover:text-blue-700"
            >
              <FiEdit />
            </Link>
            
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
