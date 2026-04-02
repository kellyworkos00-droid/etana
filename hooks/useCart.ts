'use client';

import { useCallback, useEffect, useState } from 'react';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  bulkPrice: number;
  minOrder: number;
  maxOrder?: number;
  name: string;
  sellerId: string;
  imageUrl: string;
}

const CART_STORAGE_KEY = 'eterna_cart';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart:', e);
        setCart([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addItem = useCallback(
    (item: CartItem) => {
      setCart((prev) => {
        const existing = prev.find(
          (p) => p.productId === item.productId && p.sellerId === item.sellerId
        );

        if (existing) {
          return prev.map((p) =>
            p.productId === item.productId && p.sellerId === item.sellerId
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          );
        }

        return [...prev, item];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, sellerId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.sellerId === sellerId)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, sellerId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, sellerId);
        return;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId && item.sellerId === sellerId
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const itemPrice = item.quantity >= item.minOrder ? item.bulkPrice : item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  }, [cart]);

  const getItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    isLoaded,
  };
}
