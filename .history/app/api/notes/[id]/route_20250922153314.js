import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

// GET a specific note
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: 'Could not connect to MongoDB. Please check your network connection or MongoDB Atlas whitelist settings.',
        message: dbError.message
      }, { status: 503 });
    }
    
    const note = await Note.findById(id);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error(`Error fetching note ${params?.id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update) a specific note
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { name, description, imageUrl } = await request.json();
    
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: 'Could not connect to MongoDB. Please check your network connection or MongoDB Atlas whitelist settings.',
        message: dbError.message
      }, { status: 503 });
    }
    
    const note = await Note.findByIdAndUpdate(
      id,
      { name, description, imageUrl },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error(`Error updating note ${params?.id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a specific note
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    await connectToDatabase();
    
    const note = await Note.findByIdAndDelete(id);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
