'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import NoteForm from '@/components/NoteForm';

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
        <p>Loading...</p>
      </div>
    );
  }
  
  if (error || !note) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || 'Note not found'}</p>
        <button 
          onClick={() => router.push('/')} 
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Go Back Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Note</h1>
        <button 
          onClick={() => router.back()} 
          className="mt-2 text-indigo-600 hover:text-indigo-800"
        >
          &larr; Back
        </button>
      </div>
      
      <NoteForm note={note} type="Update" />
    </div>
  );
}
