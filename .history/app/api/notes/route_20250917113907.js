import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

// GET all notes
export async function GET() {
  try {
    await connectToDatabase();
    const notes = await Note.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new note
export async function POST(request) {
  try {
    const { name, description, imageUrl } = await request.json();
    
    await connectToDatabase();
    
    const note = await Note.create({
      name,
      description,
      imageUrl
    });
    
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
