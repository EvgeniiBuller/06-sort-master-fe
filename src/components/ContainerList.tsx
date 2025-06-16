import React, { useEffect, useState } from "react";

interface Container {
  id: string;
  color: string;
  name: string;
  description: string;
}

const ContainerList = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/containers")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(setContainers)
      .catch((err) => setError(err.message));
  }, []);

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Rubbish Containers</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          {message}
        </div>
      )}

      <ul className="space-y-4">
        {containers.map((container) => (
          <li
            key={container.id}
            className="relative p-4 rounded-lg shadow-md text-white"
            style={{ backgroundColor: container.color }}
          >
            <button
              onClick={() => handleRemove(container.id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
            >
              Remove
            </button>
            <h3 className="text-xl font-semibold">{container.name}</h3>
            <p>{container.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContainerList;
