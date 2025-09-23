import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

// GET all notes
export async function GET() {
  try {
    console.log('API: Fetching all notes');
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
          createdAt: new Date().toISOString()
        }
      ], { status: 200 });
    }
    
    const notes = await Note.find({}).sort({ createdAt: -1 });
    console.log(`API: Found ${notes.length} notes`);
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('API Error fetching notes:', error);
    return NextResponse.json({ 
      error: error.message,
      detail: error.stack,
      mongoError: error.cause ? JSON.stringify(error.cause) : 'No additional details'
    }, { status: 500 });
  }
}

// POST new note
export async function POST(request) {
  try {
    const { name, description, imageUrl } = await request.json();
    console.log('API: Creating new note with data:', { name, imageUrl: imageUrl.substring(0, 30) + '...' });
    
    await connectToDatabase();
    
    const note = await Note.create({
      name,
      description,
      imageUrl
    });
    
    console.log('API: Note created successfully');
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('API Error creating note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
