"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type { CartItem } from "@/types/catalog";

type Toast = {
  id: number;
  message: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "cartId">) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ina-beauty-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const didLoadCart = useRef(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      didLoadCart.current = true;

      if (raw) {
        try {
          setItems(JSON.parse(raw) as CartItem[]);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!didLoadCart.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 2400);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "cartId">) => {
      setItems((current) => {
        const existing = current.find(
          (entry) =>
            entry.productId === item.productId && entry.variantId === item.variantId
        );

        if (existing) {
          return current.map((entry) =>
            entry.cartId === existing.cartId
              ? {
                  ...entry,
                  quantity: Math.min(entry.stock, entry.quantity + item.quantity)
                }
              : entry
          );
        }

        return [
          ...current,
          {
            ...item,
            cartId: `${item.productId}-${item.variantId || "default"}`
          }
        ];
      });

      showToast(`${item.name} ditambahkan ke pesanan.`);
    },
    [showToast]
  );

  const removeItem = useCallback((cartId: string) => {
    setItems((current) => current.filter((item) => item.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: Math.min(item.stock, Math.max(1, quantity))
            }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      total: items.reduce((total, item) => total + item.price * item.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }),
    [addItem, clearCart, items, removeItem, updateQuantity]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast ? (
        <div className="fixed left-1/2 top-5 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-blush-100 bg-white px-4 py-3 text-sm font-semibold text-ink shadow-soft">
          {toast.message}
        </div>
      ) : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
