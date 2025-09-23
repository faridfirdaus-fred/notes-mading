'use client';

import dynamic from 'next/dynamic';

// Import NotesGrid dengan dynamic import dan lazy loading
const DynamicNotesGrid = dynamic(() => import('./NotesGrid'), {
  ssr: false,
  loading: () => <p className="text-center text-amber-100">Loading notes...</p>,
});

export function NotesGridClient() {
  return <DynamicNotesGrid />;
}