'use client';

import { useEffect, useState } from 'react';
import NoteCard from './NoteCard';
import axios from 'axios';

export default function ClientNotesGrid() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk memuat data notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      // Tambahkan timestamp untuk mencegah caching
      const timestamp = new Date().getTime();
      const { data } = await axios.get(`/api/fresh-notes?t=${timestamp}`);
      setNotes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetchNotes saat komponen dimount
  useEffect(() => {
    fetchNotes();
    
    // Buat interval untuk memperbarui data setiap 10 detik
    const intervalId = setInterval(fetchNotes, 10000);
    
    // Bersihkan interval saat komponen unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading && notes.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-amber-50/70 rounded-md p-4 h-80 animate-pulse">
            <div className="h-40 bg-amber-200/50 rounded-sm mb-4"></div>
            <div className="h-4 bg-amber-200/50 rounded-sm w-3/4 mb-2"></div>
            <div className="h-20 bg-amber-200/50 rounded-sm mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-amber-200/50 rounded-sm w-1/4"></div>
              <div className="h-4 bg-amber-200/50 rounded-sm w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && notes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchNotes} 
          className="bg-amber-600 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {notes.map((note) => (
          <NoteCard 
            key={`${note._id || note.id}-${note._timestamp || Date.now()}`} 
            note={{
              id: note._id || note.id,
              name: note.name,
              description: note.description,
              imageUrl: note.imageUrl,
              createdAt: note.createdAt,
              _id: note._id || note.id
            }} 
          />
        ))}
      </div>
      
      {/* Manual refresh button */}
      <div className="mt-8 text-center">
        <button 
          onClick={fetchNotes} 
          className="bg-amber-600/70 hover:bg-amber-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Notes
        </button>
      </div>
    </>
  );
}