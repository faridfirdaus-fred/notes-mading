'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FiUpload, FiImage } from 'react-icons/fi';
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
      
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'notes_mading');
      
      // Upload to Cloudinary directly
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
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
        await axios.post('/api/notes', {
          ...data,
          imageUrl,
        });
      } else {
        await axios.put(`/api/notes/${note._id}`, {
          ...data,
          imageUrl,
        });
      }
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        {imageUrl ? (
          <div className="mt-2 relative h-64 w-full">
            <Image
              src={imageUrl}
              alt="Note"
              fill
              className="object-cover rounded-md"
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
          <div {...getRootProps()} className={`mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 
            ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-500 hover:bg-gray-50'} 
            transition-colors cursor-pointer flex flex-col items-center justify-center h-64`}>
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
      
      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : type}
      </button>
    </form>
  );
}
}
