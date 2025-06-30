
import React, { useState } from 'react';
import axios from 'axios';
import type { Advert } from '../common/types/Advert';

interface AdvertFormProps {
  onAdvertCreated: () => void; 
}

const BASE_URL = 'http://localhost:8080/api';

const AdvertForm: React.FC<AdvertFormProps> = ({ onAdvertCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!title || !description) {
      setError('Title and Description are required.');
      return;
    }

    setIsLoading(true);
    try {
      const newAdvert: Omit<Advert, 'id'> = { title, description, photoUrl: photo || null };
      await axios.post(`${BASE_URL}/adverts`, newAdvert);
      alert('Advert created successfully!');
      setTitle('');
      setDescription('');
      setPhoto('');
      onAdvertCreated();
    } catch (err) {
      console.error('Error creating advert:', err);
      if (axios.isAxiosError(err)) {
        setError('Failed to create advert: ' + (err.response?.data?.message || err.message || 'Network error'));
      } else if (err instanceof Error) {
        setError('Failed to create advert: ' + err.message);
      } else {
        setError('Failed to create advert. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-xl shadow-lg font-sans">
      <h2 className="text-gray-800 text-center mb-6 text-3xl font-bold">Create New Advert</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Title:
          </label>
          <input
            type="text"
            id="title"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea
            id="description"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-y transition duration-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2">
            Photo URL:
          </label>
          <input
            type="url"
            id="photo"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            disabled={isLoading}
            
          />
          {photo && (
            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
              <img src={photo} alt="Preview" className="w-full h-48 object-contain bg-gray-100" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-600 text-sm italic font-medium bg-red-100 p-2 rounded-md border border-red-300">{error}</p>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Advert'}
        </button>
      </form>
    </div>
  );
};

export default AdvertForm;