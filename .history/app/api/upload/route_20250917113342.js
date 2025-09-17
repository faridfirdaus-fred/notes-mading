import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function POST(request) {
  try {
    const { image } = await request.json();
    
    const result = await cloudinary.uploader.upload(image, {
      folder: 'notes-mading',
    });
    
    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
