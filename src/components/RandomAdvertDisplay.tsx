

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { Advert } from '../common/types/Advert';
import AdvertCard from './AdvertCard';

const BASE_URL = 'http://localhost:8080/api';

const RandomAdvertDisplay: React.FC = () => {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdverts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<Advert[]>(`${BASE_URL}/adverts`);
      setAdverts(response.data);
      
      if (response.data.length > 0 && currentIndex >= response.data.length) {
        setCurrentIndex(0);
      } else if (response.data.length === 0) {
        setCurrentIndex(0); 
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching adverts for display:', err);
      setError('Failed to load adverts for display.');
      setAdverts([]);
    } finally {
      setLoading(false);
    }
  }, [currentIndex]); 

  useEffect(() => {
    fetchAdverts();
   
  }, [fetchAdverts]);

  const handleNextAdvert = () => {
    if (adverts.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % adverts.length);
    }
  };

  const handlePrevAdvert = () => {
    if (adverts.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + adverts.length) % adverts.length);
    }
  };

  const currentAdvert = adverts.length > 0 ? adverts[currentIndex] : null;

  if (loading) {
    return (
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center text-blue-700 text-sm">
        Loading advert...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center text-red-700 text-sm">
        {error}
      </div>
    );
  }

  if (!currentAdvert) {
    return (
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-700 text-sm">
        No adverts available. Please add some on the Adverts page.
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl shadow-lg flex flex-col items-center">
      <h3 className="text-xl font-bold text-center text-purple-800 mb-4">Featured Advert</h3>
      <div className="relative w-full flex flex-col items-center">
        <AdvertCard advert={currentAdvert} compact={true} />

        {adverts.length > 1 && (
          <>
            <button
              onClick={handlePrevAdvert}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-75 text-white p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous advert"
            >
              &larr;
            </button>
            <button
              onClick={handleNextAdvert}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-75 text-white p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next advert"
            >
              &rarr;
            </button>
          </>
        )}
        <p className="mt-2 text-sm text-gray-600">
          {currentIndex + 1} / {adverts.length}
        </p>
      </div>
    </div>
  );
};

export default RandomAdvertDisplay;