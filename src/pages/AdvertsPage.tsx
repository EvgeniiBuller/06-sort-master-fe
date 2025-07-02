
import React from 'react';
import axios from 'axios';
import AdvertCard from '../components/AdvertCard';
import AdvertForm from '../components/AdvertForm';
//import type { Advert } from '../common/types/Advert';
import { useAdverts } from '../contexts/AdvertContext';

const BASE_URL = 'http://localhost:8080/api';

const AdvertsPage: React.FC = () => {
  const { adverts, loading, error, fetchAdverts } = useAdverts();

  const handleDeleteAdvert = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this advert?')) {
      try {
        await axios.delete(`${BASE_URL}/adverts/${id}`);
        alert('Advert deleted successfully!');
        fetchAdverts(); 
      } catch (err) {
        console.error('Error deleting advert:', err);
        if (axios.isAxiosError(err)) {
          alert('Failed to delete advert: ' + (err.response?.data?.message || err.message));
        } else {
          alert('Failed to delete advert. Please try again.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5 text-lg text-gray-700 bg-yellow-100 border border-yellow-400 rounded-md mt-5 max-w-4xl mx-auto">
        Loading adverts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5 text-lg text-red-600 bg-red-100 border border-red-300 rounded-md mt-5 max-w-4xl mx-auto">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-gray-50 rounded-xl shadow-lg font-sans">
      <h1 className="text-gray-800 text-center mb-8 text-4xl font-bold">Manage Adverts</h1>

      <AdvertForm onAdvertCreated={fetchAdverts} />

      <h2 className="text-gray-800 text-center mb-6 mt-10 text-3xl font-bold">All Adverts</h2>
      {adverts.length === 0 ? (
        <p className="text-center p-5 text-lg text-gray-700 bg-gray-100 border border-gray-300 rounded-md mt-5">
          There are no adverts to display. Create one above!
        </p>
      ) : (
        <ul className="list-none p-0 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {adverts.map((advert) => (
            <AdvertCard key={advert.id} advert={advert} onDelete={handleDeleteAdvert} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdvertsPage;