import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

interface ItemDto {
    id: number; 
    name: string;
    containerId: number | null; 
}

const ItemsPage: React.FC = () => {
    const [items, setItems] = useState<ItemDto[]>([]); 
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ItemDto[]>('/api/items'); 
                setItems(response.data);
            } catch (err) {
                console.error('Error receiving items:', err);
                
                if (axios.isAxiosError(err)) { 
                    setError('Could not load the list of items: ' + (err.response?.data?.message || err.message));
                } else if (err instanceof Error) {
                    setError('Could not load the list of items: ' + err.message);
                } else {
                    setError('The list of items could not be loaded. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []); 

    if (loading) {
        return (
            <div className="text-center p-5 text-lg text-gray-700 bg-yellow-100 border border-yellow-400 rounded-md mt-5 max-w-[900px] mx-auto">
                Loading items...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-5 text-lg text-red-600 bg-red-100 border border-red-300 rounded-md mt-5 max-w-[900px] mx-auto">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-[900px] mx-auto my-5 p-5 bg-gray-50 rounded-lg shadow-md font-sans">
            <h1 className="text-gray-800 text-center mb-6 text-4xl font-bold">All Subjects</h1>
            
            {items.length === 0 ? (
                <p className="text-center p-5 text-lg text-gray-700 bg-gray-100 border border-gray-300 rounded-md mt-5">
                    There are no items to display.
                </p>
            ) : (
                <ul className="list-none p-0 grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                    {items.map(item => (
                        <li 
                            key={item.id} 
                            className="bg-white border border-gray-300 rounded-lg p-5 shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1"
                        >
                            <h3 className="text-blue-600 mt-0 mb-3 text-2xl font-semibold">{item.name}</h3>
                            {item.containerId !== null && ( 
                                <p className="mb-2 text-gray-600 leading-relaxed">
                                    <strong className="text-gray-800">Container ID:</strong> {item.containerId}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ItemsPage;