import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants/config';

const RecentlyViewedContext = createContext(null);

const MAX_RECENT = 12;

export function RecentlyViewedProvider({ children }) {
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.recent) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recent));
  }, [recent]);

  const addRecentlyViewed = useCallback((product) => {
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  const clearRecent = useCallback(() => setRecent([]), []);

  return (
    <RecentlyViewedContext.Provider value={{ recent, addRecentlyViewed, clearRecent }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed باید داخل RecentlyViewedProvider استفاده شود.');
  return ctx;
}
