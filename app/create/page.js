'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import NoteForm dynamically with no SSR to avoid 'T' error during build
const NoteForm = dynamic(() => import('@/components/NoteForm'), { ssr: false });

export default function CreateNote() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create New Note</h1>
        <button 
          onClick={() => router.back()} 
          className="mt-2 text-gray-100"
        >
          &larr; Back
        </button>
      </div>
      
      <NoteForm type="Create" />
    </div>
  );
}
