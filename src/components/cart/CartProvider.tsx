"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  productId: number;
  quantity: number;
  isSelected: boolean;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  isReady: boolean;
  addItem: (productId: number, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  toggleItem: (productId: number) => void;
  setAllSelected: (isSelected: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "lumina-cart";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        setItems(JSON.parse(savedCart) as CartLine[]);
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isReady, items]);

  function addItem(productId: number, quantity: number) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === productId,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          productId,
          quantity,
          isSelected: true,
        },
      ];
    });
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  }

  function removeItem(productId: number) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  }

  function toggleItem(productId: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? { ...item, isSelected: !item.isSelected }
          : item,
      ),
    );
  }

  function setAllSelected(isSelected: boolean) {
    setItems((currentItems) =>
      currentItems.map((item) => ({
        ...item,
        isSelected,
      })),
    );
  }

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        isReady,
        addItem,
        updateQuantity,
        removeItem,
        toggleItem,
        setAllSelected,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}