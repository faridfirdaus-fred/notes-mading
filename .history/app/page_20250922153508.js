import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import connectToDatabase from "@/lib/mongodb";
import Note from "@/models/Note";

async function getNotes() {
  try {
    // Langsung query database daripada melalui API route
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error("MongoDB connection failed:", dbError.message);
      // Return error object instead of empty array
      return { error: true, message: dbError.message };
    }
    
    const notesData = await Note.find({}).sort({ createdAt: -1 }).lean();
    
    // Konversi dokumen MongoDB menjadi objek JavaScript biasa
    const notes = notesData.map(note => ({
      id: note._id.toString(), // Konversi ObjectId ke string
      name: note.name,
      description: note.description,
      imageUrl: note.imageUrl,
      createdAt: note.createdAt.toISOString(), // Konversi Date ke string
    }));
    
    return { notes, error: false };
  } catch (error) {
    console.error("Error loading notes:", error);
    return { error: true, message: error.message };
  }
}

export default async function Home() {
  const result = await getNotes();
  const hasError = result.error;
  const notes = result.notes || [];
  
  return (
    <div className="min-h-screen bg-amber-800 px-4 py-8">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8 bg-amber-900/70 p-4 rounded-t-lg shadow-lg">
          <h1 className="text-3xl font-bold text-amber-50 font-handwriting">Notes Mading</h1>
          <Link 
            href="/create" 
            className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors shadow-md"
          >
            Add New Note
          </Link>
        </header>
        
        {hasError ? (
          <div className="text-center py-16 bg-red-700/40 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-amber-50 mb-4">Database Connection Error</h2>
            <p className="text-amber-100 mb-4">Could not connect to MongoDB database. Please try again later.</p>
            <div className="bg-red-900/50 p-4 mx-auto max-w-md rounded text-left text-amber-100 text-sm mb-8 overflow-auto">
              <p>Error: {result.message}</p>
              <p className="mt-4">Possible solutions:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Check your internet connection</li>
                <li>Make sure your IP address is whitelisted in MongoDB Atlas</li>
                <li>Verify that your MongoDB credentials are correct</li>
              </ul>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors inline-block shadow-md"
            >
              Try Again
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16 bg-amber-700/50 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-amber-50 mb-4 font-handwriting">No notes yet</h2>
            <p className="text-amber-100 mb-8">Create your first note to get started!</p>
            <Link 
              href="/create" 
              className="bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors inline-block shadow-md"
            >
              Create Note
            </Link>
          </div>
        ) : (
          <div className="p-6 bg-amber-700/30 rounded-lg shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
