import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS, SHIPPING_METHODS } from '../constants/config';
import { getProductById } from '../data/mockData';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const TAX_RATE = 0.09;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.coupon) || 'null');
    } catch {
      return null;
    }
  });
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[1].id);
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.coupon, JSON.stringify(coupon));
  }, [coupon]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product, { color = 0, size = null, quantity = 1 } = {}) => {
    setItems((prev) => {
      const colorIndex = typeof color === 'number' ? color : 0;
      const colorName = product.colors?.[colorIndex]?.name || product.colors?.[0]?.name;
      const colorPalette = product.colors?.[colorIndex]?.palette || product.palette;
      const existing = prev.find(
        (it) => it.productId === product.id && it.size === size && it.colorIndex === colorIndex
      );
      if (existing) {
        return prev.map((it) =>
          it.productId === product.id && it.size === size && it.colorIndex === colorIndex
            ? { ...it, quantity: Math.min(it.quantity + quantity, 10) }
            : it
        );
      }
      return [
        ...prev,
        {
          key: `${product.id}-${colorIndex}-${size ?? 'x'}`,
          productId: product.id,
          name: product.name,
          brand: product.brand?.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          size,
          colorIndex,
          colorName,
          palette: colorPalette,
          image: 'side',
          quantity,
        },
      ];
    });
    setIsOpen(true);
    toast.success('به سبد خرید اضافه شد', product.name);
  }, [toast]);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((prev) =>
      prev.map((it) =>
        it.key === key ? { ...it, quantity: Math.max(1, Math.min(quantity, 10)) } : it
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const applyCoupon = useCallback(async (applyCouponFn, code) => {
    try {
      const res = await applyCouponFn(code);
      setCoupon(res.coupon);
      return res;
    } catch (e) {
      throw e;
    }
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === 'percentage') {
      return Math.round((subtotal * coupon.value) / 100);
    }
    return Math.min(coupon.value, subtotal);
  }, [coupon, subtotal]);

  const shipping = useMemo(
    () => (subtotal === 0 ? 0 : SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price || 0),
    [subtotal, shippingMethod]
  );

  const tax = useMemo(() => Math.round((subtotal - discount) * TAX_RATE), [subtotal, discount]);

  const total = subtotal - discount + shipping + tax;

  const count = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items]);

  const hydratedItems = useMemo(
    () =>
      items.map((it) => {
        const product = getProductById(it.productId);
        return product ? { ...it, product } : null;
      }).filter(Boolean),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items: hydratedItems,
        rawItems: items,
        count,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        coupon,
        shippingMethod,
        isOpen,
        setShippingMethod,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart باید داخل CartProvider استفاده شود.');
  return ctx;
}
