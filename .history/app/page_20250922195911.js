import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import connectToDatabase from "@/lib/mongodb";
import Note from "@/models/Note";
import { FaPaperclip } from 'react-icons/fa';
import { BsStickiesFill } from 'react-icons/bs';

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
    console.error("Error loading notes:", error);
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
        {/* Header dengan dekorasi */}
        <div className="relative mb-8 bg-amber-900/80 p-6 rounded-lg shadow-lg border-2 border-amber-950">
          {/* Plester dekoratif di header */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-3 bg-gray-300 opacity-80 rounded-sm shadow-sm"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-amber-50 font-handwriting text-center mt-1">
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
            <p className="text-amber-100 mb-8">Create your first note to get started!</p>
            <Link 
              href="/create" 
              className="bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors inline-block shadow-md"
            >
              Create Note
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
