import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import type { Item } from "../common/types/Item";

const BASE_URL = "http://localhost:8080/api";

const ItemsList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<Item[]>(`${BASE_URL}/items`);
      setItems(response.data);
    } catch (err) {
      console.error("Error receiving items:", err);

      if (axios.isAxiosError(err)) {
        setError(
          "Could not load the list of items: " +
            (err.response?.data?.message || err.message)
        );
      } else if (err instanceof Error) {
        setError("Could not load the list of items: " + err.message);
      } else {
        setError(
          "The list of items could not be loaded. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDeleteItem = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/items/${id}`);
      alert("Item deleted successfully!");
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

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
      <h1 className="text-gray-800 text-center mb-6 text-4xl font-bold">
        All Subjects
      </h1>

      {items.length === 0 ? (
        <p className="text-center p-5 text-lg text-gray-700 bg-gray-100 border border-gray-300 rounded-md mt-5">
          There are no items to display.
        </p>
      ) : (
        <ul className="list-none p-0 grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={handleDeleteItem} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemsList;
