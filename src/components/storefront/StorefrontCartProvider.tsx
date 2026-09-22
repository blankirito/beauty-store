"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    addStorefrontCartItemWithinStock,
    type StorefrontCartLine,
    updateStorefrontCartQuantity,
} from "@/lib/storefront/storefrontCart";

type StorefrontCartContextValue = {
    items: StorefrontCartLine[];
    isReady: boolean;
    addItem: (
        storeSlug: string,
        productId: string,
        quantity: number,
        availableStock: number,
    ) => void;

    updateQuantity: (
        storeSlug: string,
        productId: string,
        quantity: number,
        availableStock?: number,
    ) => void;
    getItemsForStore: (storeSlug: string) => StorefrontCartLine[];
    getItemCountForStore: (storeSlug: string) => number;
};

const StorefrontCartContext =
    createContext<StorefrontCartContextValue | null>(null);

const STORAGE_KEY = "lumina-storefront-cart";

export function StorefrontCartProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [items, setItems] = useState<StorefrontCartLine[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        try {
            const savedCart = window.localStorage.getItem(STORAGE_KEY);

            if (savedCart) {
                setItems(JSON.parse(savedCart) as StorefrontCartLine[]);
            }
        } catch {
            window.localStorage.removeItem(STORAGE_KEY);
        } finally {
            setIsReady(true);
        }
    }, []);

    useEffect(() => {
        if (isReady) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [isReady, items]);

    function addItem(
        storeSlug: string,
        productId: string,
        quantity: number,
        availableStock: number,
    ) {
        setItems((currentItems) =>
            addStorefrontCartItemWithinStock(
                currentItems,
                {
                    storeSlug,
                    productId,
                    quantity,
                },
                availableStock,
            ),
        );
    }

    function updateQuantity(
        storeSlug: string,
        productId: string,
        quantity: number,
        availableStock?: number,
    ) {
        const safeQuantity =
            availableStock === undefined
                ? quantity
                : Math.min(quantity, availableStock);

        setItems((currentItems) =>
            updateStorefrontCartQuantity(
                currentItems,
                storeSlug,
                productId,
                safeQuantity,
            ),
        );
    }

    function getItemsForStore(storeSlug: string) {
        return items.filter((item) => item.storeSlug === storeSlug);
    }

    function getItemCountForStore(storeSlug: string) {
        return getItemsForStore(storeSlug).reduce(
            (total, item) => total + item.quantity,
            0,
        );
    }

    const value = useMemo(
        () => ({
            items,
            isReady,
            addItem,
            updateQuantity,
            getItemsForStore,
            getItemCountForStore,
        }),
        [items, isReady],
    );

    return (
        <StorefrontCartContext.Provider value={value}>
            {children}
        </StorefrontCartContext.Provider>
    );
}

export function useStorefrontCart() {
    const context = useContext(StorefrontCartContext);

    if (!context) {
        throw new Error(
            "useStorefrontCart must be used inside StorefrontCartProvider.",
        );
    }

    return context;
}