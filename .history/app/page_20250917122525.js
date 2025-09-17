import Image from "next/image";
import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

async function getNotes() {
  try {
    // Langsung query database daripada melalui API route
    await connectToDatabase();
    const notesData = await Note.find({}).sort({ createdAt: -1 }).lean();
    
    // Konversi dokumen MongoDB menjadi objek JavaScript biasa
    const notes = notesData.map(note => ({
      id: note._id.toString(), // Konversi ObjectId ke string
      name: note.name,
      description: note.description,
      imageUrl: note.imageUrl,
      createdAt: note.createdAt.toISOString(), // Konversi Date ke string
    }));
    
    return notes;
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
}

export default async function Home() {
  const notes = await getNotes();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Notes Mading</h1>
        <Link 
          href="/create" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New Note
        </Link>
      </header>
      
      {notes.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No notes yet</h2>
          <p className="text-gray-500 mb-8">Create your first note to get started!</p>
          <Link 
            href="/create" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors inline-block"
          >
            Create Note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
  
