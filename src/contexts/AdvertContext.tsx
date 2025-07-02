import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { Advert } from '../common/types/Advert'; 

interface AdvertContextType {
  adverts: Advert[];
  loading: boolean;
  error: string | null;
  fetchAdverts: () => Promise<void>;
}

const AdvertContext = createContext<AdvertContextType | undefined>(undefined);

interface AdvertProviderProps {
  children: ReactNode; 
}

export const AdvertProvider: React.FC<AdvertProviderProps> = ({ children }) => {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdverts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/adverts');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText || 'Unknown error'}`);
      }
      const data: Advert[] = await response.json();
      setAdverts(data);
    } catch (err: unknown) { 
      let errorMessage = 'Failed to fetch adverts';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      console.error("Error fetching adverts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdverts();
  }, []);

  const contextValue: AdvertContextType = {
    adverts,
    loading,
    error,
    fetchAdverts,
  };

  return (
    <AdvertContext.Provider value={contextValue}>
      {children}
    </AdvertContext.Provider>
  );
};

export const useAdverts = () => {
  const context = useContext(AdvertContext);
  if (context === undefined) {
    throw new Error('useAdverts must be used within an AdvertProvider');
  }
  return context;
};