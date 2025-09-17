import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CldUploadWidget } from 'next-cloudinary';
import { FiUpload } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NoteForm({ note, type }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(note?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
          <CldUploadWidget
            uploadPreset="notes_mading"
            onSuccess={(result) => {
              setImageUrl(result.info.secure_url);
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="mt-1 flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full"
              >
                <FiUpload className="mr-2" />
                Upload Image
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : type}
      </button>
    </form>
  );
}
