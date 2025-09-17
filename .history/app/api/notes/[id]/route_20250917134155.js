import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

// GET a specific note
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    await connectToDatabase();
    
    const note = await Note.findById(id);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update) a specific note
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, description, imageUrl } = await request.json();
    
    await connectToDatabase();
    
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a specific note
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
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
