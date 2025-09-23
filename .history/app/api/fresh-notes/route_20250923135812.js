import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

// GET latest notes with cache-busting
export async function GET() {
  try {
    console.log('API: Fetching fresh notes (no-cache)');
    const db = await connectToDatabase();
    
    // Check if we got a fallback connection in development mode
    if (db.isFallback && process.env.NODE_ENV !== 'production') {
      console.warn('Using fallback data due to MongoDB connection issue');
      return NextResponse.json([
        {
          id: 'fallback-1',
          name: 'Connection Error',
          description: 'Could not connect to MongoDB. This is a fallback note.',
          imageUrl: 'https://placehold.co/600x400?text=Database+Error',
          createdAt: new Date().toISOString(),
          _timestamp: Date.now() // Add timestamp for cache-busting
        }
      ], { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    const notes = await Note.find({}).sort({ createdAt: -1 });
    
    // Add timestamp to each note for cache busting
    const notesWithTimestamp = notes.map(note => {
      const plainNote = note.toObject();
      plainNote._timestamp = Date.now();
      return plainNote;
    });
    
    console.log(`API: Found ${notes.length} fresh notes`);
    
    return NextResponse.json(notesWithTimestamp, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('API Error fetching fresh notes:', error);
    return NextResponse.json({ 
      error: error.message,
      detail: error.stack,
      mongoError: error.cause ? JSON.stringify(error.cause) : 'No additional details',
      _timestamp: Date.now() // Add timestamp for cache-busting
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}