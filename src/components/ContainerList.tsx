import React, { useEffect, useState, useCallback } from "react";
import type Container from "../common/types/Container";
import ContainerCard from "./ContainerCard";


const ContainerList = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

    const fetchContainers = useCallback(async () => {
   try {
      const res = await fetch("/api/containers");
      if (!res.ok) throw new Error("The network response was out of order");
      const data = await res.json();
      setContainers(data);
      setError(null); 
    } catch (err: any) {
      setError(err.message);
      setContainers([]); 
    }
  }, []);

  useEffect(() => {
    fetchContainers();
    }, [fetchContainers]);

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/containers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete container");
      }

      setContainers((prev) => prev.filter((c) => c.id !== id));
      setMessage("Container successfully deleted");
      setError(null);
    } catch (err: any) {
      setError("Error deleting container");
      console.error(err);
    }
  };

  const handleItemAdded = () => {
    fetchContainers();
    setMessage("Item added successfully"); 
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Rubbish Containers</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          {message}
        </div>
      )}

      <ul className="space-y-4">
        {containers.map((container: Container) => (
        
        <ContainerCard key={container.id} 
            container={container}
            onRemove={handleRemove} 
            onItemAdded={handleItemAdded} />
        ))}
        </ul>
    </div>
  );
};

export default ContainerList;
