import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function POST(request) {
  try {
    // Log request headers untuk debugging
    const headers = Object.fromEntries(request.headers);
    console.log('API: Receiving upload request with headers:', 
      JSON.stringify({
        host: headers.host,
        origin: headers.origin,
        'user-agent': headers['user-agent']
      })
    );
    
    // Deteksi jika request datang dari Ngrok
    const isNgrok = headers.host?.includes('ngrok') || headers.origin?.includes('ngrok');
    if (isNgrok) {
      console.log('API: Request detected from Ngrok tunnel');
    }
    
    // Pastikan request adalah multipart/form-data
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      console.error('API: No file received in upload request');
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }
    
    console.log('API: Received file of type:', file.type, 'name:', file.name, 'size:', file.size);
    
    // Konversi file ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('API: Converting file to buffer, size:', buffer.length);
    
    // Upload ke Cloudinary dengan opsi timeout yang lebih tinggi
    const result = await new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: 'notes-mading',
        resource_type: 'auto',
        timeout: 120000, // 2 menit timeout
        use_filename: true,
        unique_filename: true
      };
      
      console.log('API: Starting Cloudinary upload with options:', JSON.stringify(uploadOptions));
      
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('API: Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('API: Cloudinary upload success, URL:', result.secure_url);
            resolve(result);
          }
        }
      );
      
      // Handle potensi error pada stream
      uploadStream.on('error', (error) => {
        console.error('API: Upload stream error:', error);
        reject(error);
      });
      
      uploadStream.end(buffer);
    });
    
    // Tambahkan headers untuk menghindari cache
    return NextResponse.json({ url: result.secure_url }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('API: Upload error:', error);
    // Berikan informasi error yang lebih detail
    const errorDetail = {
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      // Jika error dari Cloudinary, ambil detailnya
      cloudinaryError: error.error ? error.error : undefined
    };
    
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: errorDetail
    }, { status: 500 });
  }
}

// Tambahkan handler untuk OPTIONS request (preflight CORS)
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
