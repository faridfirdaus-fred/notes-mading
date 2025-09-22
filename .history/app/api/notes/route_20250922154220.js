import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

// GET all notes
export async function GET() {
  try {
    console.log('API: Fetching all notes');
    await connectToDatabase();
    const notes = await Note.find({}).sort({ createdAt: -1 });
    console.log(`API: Found ${notes.length} notes`);
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('API Error fetching notes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new note
export async function POST(request) {
  try {
    const { name, description, imageUrl } = await request.json();
    console.log('API: Creating new note');
    
    await connectToDatabase();
    
    const note = await Note.create({
      name,
      description,
      imageUrl
    });
    
    console.log('API: Note created successfully');
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
