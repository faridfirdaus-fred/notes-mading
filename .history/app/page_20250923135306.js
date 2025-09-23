import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import connectToDatabase from "@/lib/mongodb";
import Note from "@/models/Note";
import { FaPaperclip } from 'react-icons/fa';
import { BsStickiesFill } from 'react-icons/bs';

async function getNotes() {
  try {
    console.log('Home page: Fetching notes from database');
    // Langsung query database daripada melalui API route
    const db = await connectToDatabase();
    
    // Check if we got a fallback connection in development mode
    if (db.isFallback && process.env.NODE_ENV !== 'production') {
      console.warn('Home page: Using fallback data due to MongoDB connection issue');
      return [
        {
          id: 'fallback-1',
          name: 'Connection Error',
          description: 'Could not connect to MongoDB. This is a fallback note for testing.',
          imageUrl: 'https://placehold.co/600x400?text=Database+Error',
          createdAt: new Date().toISOString()
        },
        {
          id: 'fallback-2',
          name: 'Development Mode',
          description: 'Application is running in development mode with limited functionality.',
          imageUrl: 'https://placehold.co/600x400?text=Dev+Mode',
          createdAt: new Date().toISOString()
        }
      ];
    }
    
    const notesData = await Note.find({}).sort({ createdAt: -1 }).lean();
    console.log(`Home page: Found ${notesData.length} notes`);
    
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
    console.error("Error loading notes:", error);
    
    // Return fallback data in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Home page: Using fallback data due to error');
      return [
        {
          id: 'error-1',
          name: 'Error Loading Notes',
          description: `An error occurred while loading notes: ${error.message}. Check the console for more details.`,
          imageUrl: 'https://placehold.co/600x400?text=Error',
          createdAt: new Date().toISOString()
        }
      ];
    }
    
    // In production, return empty array
    return [];
  }
}

// Komponen ornamen dekoratif untuk halaman utama
function HomeDecoration({ type, style }) {
  return (
    <div className="absolute" style={style}>
      {type === 'pin' && (
        <div className="w-5 h-5 bg-blue-500 rounded-full shadow-md"></div>
      )}
      {type === 'paperclip' && (
        <FaPaperclip size={24} className="text-gray-400 drop-shadow-md" />
      )}
      {type === 'sticky' && (
        <div className="w-16 h-16 bg-green-200 -rotate-3 shadow-md p-2">
          <p className="text-xs font-handwriting text-gray-700">Catatan!</p>
        </div>
      )}
    </div>
  );
}

export default async function Home() {
  const notes = await getNotes();
  
  // Dekorasi untuk halaman utama dengan posisi yang berbeda dari halaman team
  const decorations = [
    { type: 'pin', style: { top: '70px', left: '5%' } },
    { type: 'pin', style: { top: '80px', right: '10%' } },
    { type: 'paperclip', style: { bottom: '20%', left: '8%', transform: 'rotate(25deg)' } },
    { type: 'paperclip', style: { top: '35%', right: '7%', transform: 'rotate(-30deg)' } },
    { type: 'sticky', style: { bottom: '10%', right: '5%' } },
  ];
  
  return (
    <div className="min-h-screen px-4 py-8 relative">
      <div className="container mx-auto">
        {/* Header dengan dekorasi (tanpa plester) */}
        <div className="relative mb-8 bg-amber-900/80 p-6 rounded-lg shadow-lg border-2 border-amber-950">
          <h2 className="text-3xl font-bold text-amber-50 font-handwriting text-center">
            Notes Board
          </h2>
        </div>
        
        {/* Elemen dekoratif */}
        {decorations.map((deco, index) => (
          <HomeDecoration key={index} type={deco.type} style={deco.style} />
        ))}
        
        {/* Konten utama */}
        {notes.length === 0 ? (
          <div className="text-center py-16 bg-amber-700/70 rounded-lg shadow-inner border-2 border-amber-800 relative z-10">
            <h2 className="text-2xl font-semibold text-amber-50 mb-4 font-handwriting">No notes yet</h2>
            <p className="text-amber-100 mb-8">
              This bulletin board is empty. Start by adding your first note!
            </p>
            <Link 
              href="/create" 
              className="bg-amber-600 hover:bg-amber-500 transition-all text-white px-6 py-3 rounded-md shadow-md inline-flex items-center"
            >
              <BsStickiesFill className="mr-2" />
              Create First Note
            </Link>
          </div>
        ) : (
          <div className="relative bg-amber-900/60 border-4 border-amber-950 rounded-md p-6 shadow-2xl">
            {/* Cork Board Texture - mirip dengan halaman team tapi dengan opacity berbeda */}
            <div 
              className="bg-cork bg-repeat rounded-md p-6" 
              style={{ 
                backgroundImage: "url('https://www.transparenttextures.com/patterns/cork-board.png')",
                minHeight: '500px'
              }}
            >
              {/* Grid untuk menampilkan notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
