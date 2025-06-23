import React from 'react'
import type Container from '../common/types/Container';
import CreateItemForm from './CreateItemForm';

interface Props {
    container: Container
    onRemove: (id: string) => void; 
    onItemAdded: () => void;
}
export default function ContainerCard({container, onRemove, onItemAdded }: Props) {

    
  

  return (
    <li
     key={container.id}
            className="relative p-4 rounded-lg shadow-md text-white"
            style={{ backgroundColor: container.color }}
          >
            <button
              onClick={() => onRemove(container.id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
            >
              Remove
            </button>
            <h3 className="text-xl font-semibold">{container.name}</h3>
            <p>{container.description}</p>

            <CreateItemForm containerId={container.id} onItemAdded={onItemAdded}/>
    </li>
  );
}
