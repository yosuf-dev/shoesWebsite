import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../constants/config';
import { useToast } from './ToastContext';

const MAX_COMPARE = 4;

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.compare) || '[]');
    } catch {
      return [];
    }
  });
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.compare, JSON.stringify(compareList));
  }, [compareList]);

  const isInCompare = useCallback((productId) => compareList.includes(Number(productId)), [compareList]);

  const toggleCompare = useCallback(
    (productId) => {
      const id = Number(productId);
      setCompareList((prev) => {
        if (prev.includes(id)) {
          return prev.filter((p) => p !== id);
        }
        if (prev.length >= MAX_COMPARE) {
          toast.error(`حداکثر ${MAX_COMPARE} محصول قابل مقایسه است.`);
          return prev;
        }
        toast.success('به لیست مقایسه اضافه شد');
        return [...prev, id];
      });
    },
    [toast]
  );

  const removeFromCompare = useCallback((productId) => {
    setCompareList((prev) => prev.filter((p) => p !== Number(productId)));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const value = useMemo(
    () => ({ compareList, isInCompare, toggleCompare, removeFromCompare, clearCompare }),
    [compareList, isInCompare, toggleCompare, removeFromCompare, clearCompare]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare باید داخل CompareProvider استفاده شود.');
  return ctx;
}
