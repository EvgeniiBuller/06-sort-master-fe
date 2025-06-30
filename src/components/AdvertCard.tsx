
import React from 'react';
import type { Advert } from '../common/types/Advert';

interface AdvertCardProps {
  advert: Advert;
  onDelete?: (id: number) => void; 
  compact?: boolean; 
}

const AdvertCard: React.FC<AdvertCardProps> = ({ advert, onDelete, compact = false }) => {
  
  const cardClasses = `
    bg-white rounded-lg shadow-md flex flex-col items-center text-center
    transition duration-300 transform hover:scale-105 overflow-hidden
    ${compact ? 'max-w-xs p-3' : 'w-full p-4'}
  `;

  const imageClasses = `
    w-full object-cover rounded-md ${compact ? 'h-24 mb-2' : 'h-48 mb-4'}
  `;

  const titleClasses = `
    font-semibold text-gray-800 ${compact ? 'text-md mb-1' : 'text-xl mb-2'}
  `;

  const descriptionClasses = `
    text-gray-600 ${compact ? 'text-xs line-clamp-2' : 'text-sm mb-4'}
  `;

  return (
    <li className={cardClasses}>
      {advert.photo && ( 
        <img
          src={advert.photo}
          alt={advert.title}
          className={imageClasses}
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image'; }} // Заглушка при ошибке загрузки
        />
      )}
      <h2 className={titleClasses}>{advert.title}</h2>
      <p className={descriptionClasses}>{advert.description}</p>
      {onDelete && ( 
        <button
          onClick={() => onDelete(advert.id)}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300 ease-in-out"
        >
          Delete
        </button>
      )}
    </li>
  );
};

export default AdvertCard;