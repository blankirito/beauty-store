"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type WishlistContextValue = {
  productIds: number[];
  isReady: boolean;
  hasItem: (productId: number) => boolean;
  toggleItem: (productId: number) => void;
  removeItem: (productId: number) => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "lumina-wishlist";

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [productIds, setProductIds] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedWishlist = window.localStorage.getItem(STORAGE_KEY);

    if (savedWishlist) {
      try {
        setProductIds(JSON.parse(savedWishlist));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    }
  }, [isReady, productIds]);

  function hasItem(productId: number) {
    return productIds.includes(productId);
  }

  function toggleItem(productId: number) {
    setProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function removeItem(productId: number) {
    setProductIds((current) => current.filter((id) => id !== productId));
  }

  const value = useMemo(
    () => ({
      productIds,
      isReady,
      hasItem,
      toggleItem,
      removeItem,
    }),
    [productIds, isReady],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider.");
  }

  return context;
}