
import React from 'react';
import type { Item } from '../common/types/Item';
 

interface ItemCardProps {
    item: Item;

    onDelete: (id: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {

    const handleDeleteClick = () => {

        if (window.confirm(`Are you sure you want to delete item "${item.name}"?`)) {
            onDelete(item.id);
        }
    };

    return (
        <li
            key={item.id}
            className="bg-white border border-gray-300 rounded-lg p-5 shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1"
        >
            <h3 className="text-blue-600 mt-0 mb-3 text-2xl font-semibold">{item.name}</h3>
            {item.container !== null && item.container !== undefined ? (
                <div className="mb-2 text-gray-600 leading-relaxed">
                    <strong className="text-gray-800">Container:</strong>{' '}
                    
                    <span className="font-medium" style={{ color: item.container.color }}>
                        {item.container.name}
                    </span>
                    
                    {item.container.description && (
                        <p className="text-sm text-gray-500 mt-1">
                            <strong className="text-gray-700">Description:</strong> {item.container.description}
                        </p>
                    )}
                </div>
            ) : ( 
                <p className="mb-2 text-gray-600 leading-relaxed">
                    <strong className="text-gray-800">Container:</strong> No
                </p>
            )}
            <button
                onClick={handleDeleteClick}
                className="delete-button bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 mt-4"
            >
                Delete
            </button>
        </li>
    );
};

export default ItemCard;