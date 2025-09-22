'use client';

import { useRouter } from 'next/navigation';
import NoteForm from '@/components/NoteForm';

export default function CreateNote() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create New Note</h1>
        <button 
          onClick={() => router.back()} 
          className="mt-2 text-white"
        >
          &larr; Back
        </button>
      </div>
      
      <NoteForm type="Create" />
    </div>
  );
}
