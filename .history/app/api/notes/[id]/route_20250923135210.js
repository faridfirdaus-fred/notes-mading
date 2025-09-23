import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

// GET a specific note
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    console.log(`API: Fetching note with ID: ${id}`);
    
    const db = await connectToDatabase();
    
    // Check if we got a fallback connection in development mode
    if (db.isFallback && process.env.NODE_ENV !== 'production') {
      console.warn('Using fallback data due to MongoDB connection issue');
      return NextResponse.json({
        _id: id,
        name: 'Connection Error',
        description: 'Could not connect to MongoDB. This is a fallback note for testing.',
        imageUrl: 'https://placehold.co/600x400?text=Database+Error',
        createdAt: new Date().toISOString()
      }, { status: 200 });
    }
    
    const note = await Note.findById(id);
    
    if (!note) {
      console.log(`API: Note with ID ${id} not found`);
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    console.log(`API: Successfully retrieved note with ID ${id}`);
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error(`API Error fetching note with ID ${params?.id}:`, error);
    return NextResponse.json({ 
      error: error.message,
      detail: error.stack,
      mongoError: error.cause ? JSON.stringify(error.cause) : 'No additional details'
    }, { status: 500 });
  }
}

// PUT (update) a specific note
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { name, description, imageUrl } = await request.json();
    console.log(`API: Updating note with ID: ${id}`);
    
    const db = await connectToDatabase();
    
    // Check if we got a fallback connection in development mode
    if (db.isFallback && process.env.NODE_ENV !== 'production') {
      console.warn('Using fallback update response due to MongoDB connection issue');
      return NextResponse.json({
        _id: id,
        name,
        description,
        imageUrl,
        updatedAt: new Date().toISOString()
      }, { status: 200 });
    }
    
    const note = await Note.findByIdAndUpdate(
      id,
      { name, description, imageUrl },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      console.log(`API: Note with ID ${id} not found for update`);
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    console.log(`API: Successfully updated note with ID ${id}`);
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error(`API Error updating note with ID ${params?.id}:`, error);
    return NextResponse.json({ 
      error: error.message,
      detail: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      mongoError: error.cause ? JSON.stringify(error.cause) : 'No additional details'
    }, { status: 500 });
  }
}

// DELETE a specific note
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    console.log(`API: Deleting note with ID: ${id}`);
    
    const db = await connectToDatabase();
    
    // Check if we got a fallback connection in development mode
    if (db.isFallback && process.env.NODE_ENV !== 'production') {
      console.warn('Using fallback delete response due to MongoDB connection issue');
      return NextResponse.json({ 
        message: 'Note deleted successfully (fallback mode)',
        id: id
      }, { status: 200 });
    }
    
    const note = await Note.findByIdAndDelete(id);
    
    if (!note) {
      console.log(`API: Note with ID ${id} not found for deletion`);
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    console.log(`API: Successfully deleted note with ID ${id}`);
    return NextResponse.json({ 
      message: 'Note deleted successfully',
      id: id
    }, { status: 200 });
  } catch (error) {
    console.error(`API Error deleting note with ID ${params?.id}:`, error);
    return NextResponse.json({ 
      error: error.message,
      detail: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      mongoError: error.cause ? JSON.stringify(error.cause) : 'No additional details'
    }, { status: 500 });
  }
}
