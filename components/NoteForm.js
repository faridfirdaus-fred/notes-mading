'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUpload, FiImage } from 'react-icons/fi';
import { FaThumbtack } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

export default function NoteForm({ note, type }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(note?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: note?.name || '',
      description: note?.description || '',
    },
  });
  
  // Definisikan onDrop terlebih dahulu sebelum digunakan dalam useDropzone
  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      console.log('Uploading file:', file.name, 'size:', file.size, 'type:', file.type);
      
      // Validasi file sebelum upload
      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('File terlalu besar. Ukuran maksimum adalah 10MB.');
      }
      
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        throw new Error('Jenis file tidak didukung. Harap unggah file JPEG, PNG, GIF, atau WEBP.');
      }
      
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      // Tambahkan timestamp untuk menghindari cache
      const timestamp = new Date().getTime();
      const uploadUrl = `/api/upload?t=${timestamp}`;
      
      // Upload melalui API route lokal dengan timeout lebih panjang
      console.log(`Sending file to local API route: ${uploadUrl}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 detik timeout
      
      try {
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          headers: {
            // Tambahkan header khusus untuk membantu debugging
            'X-Client-Info': 'NoteForm-Upload',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
          try {
            // Coba parse respons error sebagai JSON
            const errorData = await response.json();
            console.error('Upload response error (JSON):', errorData);
            errorMessage = errorData.error || errorData.details?.message || errorMessage;
          } catch (e) {
            // Jika bukan JSON, baca sebagai teks
            const errorText = await response.text();
            console.error('Upload response error (Text):', errorText);
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Upload successful, received URL:', data.url);
        
        if (data.url) {
          setImageUrl(data.url);
        } else {
          throw new Error('No URL returned from upload');
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Upload timed out. Please try again with a smaller file or check your connection.');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, []);
  
  // Inisialisasi useDropzone setelah onDrop didefinisikan
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  
  // Tambahkan penanganan khusus untuk deteksi koneksi ngrok
  useEffect(() => {
    // Deteksi jika aplikasi berjalan melalui ngrok
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('ngrok')) {
        console.log('Detected running through ngrok:', hostname);
      }
    }
  }, []);

  const onSubmit = async (data) => {
    if (!imageUrl) {
      alert('Please upload an image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (type === 'Create') {
        console.log('Creating new note with data:', { ...data, imageUrl: imageUrl.substring(0, 30) + '...' });
        const response = await axios.post('/api/notes', {
          ...data,
          imageUrl,
        });
        console.log('Create note response:', response.data);
      } else {
        // Pastikan note._id (id dari MongoDB) tersedia dan digunakan
        console.log('Updating note with ID:', note._id);
        const response = await axios.put(`/api/notes/${note._id}`, {
          ...data,
          imageUrl,
        });
        console.log('Update note response:', response.data);
      }
      
      // Navigate to home page and refresh data
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.response?.data?.error || error.message || 'Unknown error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-6 relative"
      >
        {/* Thumbtack/Pin at the top */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-yellow-500">
          <FaThumbtack size={24} />
        </div>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Title
          </label>
          <input
            id="name"
            className={`w-full text-gray-800 px-3 py-2 border rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            id="description"
            className={`w-full px-3 text-gray-800 py-2 border rounded-md ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Image</label>
          
          {imageUrl ? (
            <div className="relative w-full h-64 mb-2 border rounded-md overflow-hidden group">
              <Image
                src={imageUrl}
                alt="Note"
                fill
                sizes="100%"
                className="object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setImageUrl('')}
                title="Remove image"
              >
                <span className="sr-only">Remove</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div 
              {...getRootProps()}
              className={`border-2 border-dashed border-gray-300 rounded-md h-64 flex items-center justify-center cursor-pointer
                ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-500 hover:bg-gray-50'}
              `}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="text-center">
                  <FiUpload className="w-12 h-12 mx-auto text-gray-400 animate-bounce" />
                  <p className="mt-1 text-sm text-gray-500">Uploading...</p>
                </div>
              ) : (
                <div className="text-center">
                  <FiImage className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    Drag & drop an image here, or click to select
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? 'Submitting...' : type}
          </button>
        </div>
      </form>
    </div>
  );
}