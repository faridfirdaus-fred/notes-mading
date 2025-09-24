'use client';

import { useState, useCallback } from 'react';
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
  
  // Tambahkan penanganan khusus untuk deteksi koneksi ngrok
  useEffect(() => {
    // Deteksi jika aplikasi berjalan melalui ngrok
    const hostname = window.location.hostname;
    if (hostname.includes('ngrok')) {
      console.log('Detected running through ngrok:', hostname);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });
  
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
      
      // Force a hard refresh of the page to see changes
      window.location.href = '/';
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
        className="relative bg-yellow-50 rounded-md overflow-hidden p-6 shadow-md transform transition-all max-w-md mx-auto" 
        style={{
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Thumbtack/Pin at the top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10">
          <FaThumbtack size={24} className="text-red-500 drop-shadow-md" />
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 font-handwriting"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { required: 'Description is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-handwriting text-gray-800"
            />
            {errors.description && (
              <p className="mt-1 text-sm  text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            {imageUrl ? (
              <div className="mt-2 relative h-52 w-52 mx-auto border-2 border-gray-100 shadow-sm">
                <Image
                  src={imageUrl}
                  alt="Note"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10"
                >
                  X
                </button>
              </div>
            ) : (
              <div {...getRootProps()} className={`mt-1 border-2 border-dashed border-gray-300 p-4 
                ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-500 hover:bg-gray-50'} 
                transition-colors cursor-pointer flex flex-col items-center justify-center h-52 w-52 mx-auto`}>
                <input {...getInputProps()} />
                <FiImage className="text-gray-400 text-4xl mb-3" />
                {isUploading ? (
                  <p className="text-sm text-gray-500">Uploading...</p>
                ) : isDragActive ? (
                  <p className="text-sm text-gray-500">Drop the image here...</p>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Drag and drop an image here, or click to select a file</p>
                    <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, GIF</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : type}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
