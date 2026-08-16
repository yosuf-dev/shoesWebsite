import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../constants/config';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = useCallback(
    (productId) => wishlist.includes(Number(productId)),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (productId) => {
      setWishlist((prev) => {
        const id = Number(productId);
        return prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      });
      return !isInWishlist(productId);
    },
    [isInWishlist]
  );

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((p) => p !== Number(productId)));
  }, []);

  const value = useMemo(
    () => ({ wishlist, isInWishlist, toggleWishlist, removeFromWishlist }),
    [wishlist, isInWishlist, toggleWishlist, removeFromWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist باید داخل WishlistProvider استفاده شود.');
  return ctx;
}
