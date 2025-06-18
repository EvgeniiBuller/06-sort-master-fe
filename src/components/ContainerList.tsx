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

  const [itemInputs, setItemInputs] = useState<Record<string, string>>({});

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

  const handleAddItem = async (containerId: string) => {
    const itemName = itemInputs[containerId];
    if (!itemName) return;

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName, containerId }),
      });

      if (!res.ok) throw new Error("Failed to add item");

      setMessage("Item added successfully");
      setItemInputs((prev) => ({ ...prev, [containerId]: "" }));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
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
            <div className="mt-4 flex flex-col gap-2 bg-white/90 rounded p-2 w-full max-w-xs text-black">
              <input
                type="text"
                placeholder="Item name"
                value={itemInputs[container.id] || ""}
                onChange={(e) =>
                  setItemInputs((prev) => ({
                    ...prev,
                    [container.id]: e.target.value,
                  }))
                }
                className="px-2 py-1 rounded border border-gray-300"
              />
              <button
                onClick={() => handleAddItem(container.id)}
                className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
              >
                Add Item
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContainerList;
