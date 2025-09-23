'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import NoteForm from '@/components/NoteForm';
import { use } from 'react';

export default function EditNote({ params }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await axios.get(`/api/notes/${id}`);
        setNote(data);
      } catch (err) {
        setError('Failed to load note');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNote();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-amber-700/70 rounded-lg shadow-inner border-2 border-amber-800 p-8 max-w-md mx-auto">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-amber-600 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-amber-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-amber-600 rounded w-1/2"></div>
          </div>
          <p className="mt-4 text-amber-100">Loading note data...</p>
        </div>
      </div>
    );
  }
  
  if (error || !note) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-700/70 rounded-lg shadow-inner border-2 border-red-800 p-8 max-w-md mx-auto">
          <div className="text-red-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-bold">{error || 'Note not found'}</p>
            <p className="mt-2 text-sm">The note you&apos;re looking for might have been deleted or doesn&apos;t exist.</p>
          </div>
          <button 
            onClick={() => router.push('/')} 
            className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-all"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Note</h1>
        <button 
          onClick={() => router.back()} 
          className="mt-2 text-gray-100"
        >
          &larr; Back
        </button>
      </div>
      
      <NoteForm note={note} type="Update" />
    </div>
  );
}
