import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function POST(request) {
  try {
    console.log('API: Receiving upload request');
    
    // Pastikan request adalah multipart/form-data
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      console.error('API: No file received in upload request');
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }
    
    console.log('API: Received file of type:', file.type);
    
    // Konversi file ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('API: Converting file to buffer, size:', buffer.length);
    
    // Upload ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'notes-mading',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('API: Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('API: Cloudinary upload success, URL:', result.secure_url);
            resolve(result);
          }
        }
      ).end(buffer);
    });
    
    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error('API: Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
