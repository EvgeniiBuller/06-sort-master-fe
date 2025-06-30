import React, { useEffect, useState } from "react"; 
import RandomAdvertDisplay from "../components/RandomAdvertDisplay";


    

interface Container {
  id: number;
  name: string;
  color: string;
  description: string;
}

interface Item {
  id: number;
  name: string;
  type: string;
  description: string;
  containerId: number | null;
}

// Вы уже предоставили этот интерфейс, я его оставляю
interface SearchResultItem {
  id: number;
  name: string;
  type: string;
  description: string;
  container: Container | null;
}

const BASE_URL = 'http://localhost:8080/api';

const Home: React.FC = () => { // Указываем тип компонента React.FC
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]); // Тип уже правильный
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (filter.trim() === "") {
      setResults([]);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        // Запрос к items/search
        const itemsResponse = await fetch(`${BASE_URL}/items/search?name=${encodeURIComponent(filter)}`);
        if (!itemsResponse.ok) {
          throw new Error(`Failed to fetch items: ${itemsResponse.statusText}`);
        }
        const itemsData: Item[] = await itemsResponse.json();

        // Запрос к containers
        const containersResponse = await fetch(`${BASE_URL}/containers`);
        if (!containersResponse.ok) {
          throw new Error(`Failed to fetch containers: ${containersResponse.statusText}`);
        }
        const containersData: Container[] = await containersResponse.json();

        // Создание карты контейнеров для быстрого поиска
        const containersMap = new Map<number, Container>();
        containersData.forEach(c => containersMap.set(c.id, c));

        // Маппинг результатов
        const mappedResults: SearchResultItem[] = itemsData.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          description: item.description,
          container: item.containerId ? containersMap.get(item.containerId) || null : null
        }));

        setResults(mappedResults);

      } catch (err: unknown) { // Использование unknown, как обсуждалось
        console.error('Error fetching filtered items:', err);

        let errorMessage = 'Unknown error';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        setError('Failed to fetch filtered items: ' + errorMessage);
        setResults([]);
      } finally { // Блок finally здесь расположен правильно, сразу после catch
        setLoading(false);
      }
    }, 300); // Закрывающая скобка для setTimeout и его задержка

    // Функция очистки для useEffect
    return () => clearTimeout(timeoutId); // timeoutId здесь доступен
  }, [filter]); // Зависимость useEffect

  return (
    <div className="max-w-7xl mx-auto my-8 p-6 bg-gray-50 rounded-xl shadow-lg font-sans flex flex-col md:flex-row gap-8">

      <div className="w-full md:w-1/4 p-4 bg-white rounded-lg shadow-md flex flex-col items-center md:order-1">
        <h2 className="text-gray-800 text-center mb-6 text-3xl font-bold">Special Offer</h2>
        <div className="mt-auto">
          <RandomAdvertDisplay />
        </div>
      </div>

      <div className="w-full md:w-3/4 p-4 bg-white rounded-xl shadow-lg md:order-2">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Find Your Item's Container</h2>

        <input
          type="text"
          placeholder="Search item name (e.g., newspaper, book)..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-6 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />

        {loading && (
          <div className="text-center p-4 text-lg text-gray-700 bg-yellow-50 border border-yellow-200 rounded-md">
            Searching...
          </div>
        )}

        {error && (
          <div className="text-red-600 text-center p-4 bg-red-50 border border-red-200 rounded-md">
            Error: {error}
          </div>
        )}

        {!loading && !error && filter.trim() !== "" && results.length === 0 && (
          <div className="text-gray-500 text-center p-4 bg-gray-50 border border-gray-200 rounded-md">
            No matching items found for "{filter}".
          </div>
        )}

        <ul className="space-y-4">
          {results.map((result) => (
            <li
              key={result.id}
              className="p-5 rounded-lg shadow-md transition-shadow duration-200 ease-in-out hover:shadow-xl"
              style={{ backgroundColor: result.container?.color || '#f0f0f0', color: result.container ? 'white' : '#333' }}
            >
              <h3 className="text-2xl font-semibold mb-2">{result.name}</h3>
              <p className="text-lg font-medium">{result.type}</p>
              <p className="text-base mb-2">{result.description}</p>
              {result.container ? (
                <>
                  <p className="text-xl font-bold mt-2">
                    Place in: {result.container.name} Container
                  </p>
                  <p className="text-sm">
                    Container Description: {result.container.description}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold mt-2">No specific container assigned.</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;