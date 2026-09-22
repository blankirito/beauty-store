export type StorefrontCartLine = {
  storeSlug: string;
  productId: string;
  quantity: number;
  isSelected: boolean;
};

type StorefrontCartItemInput = {
  storeSlug: string;
  productId: string;
  quantity: number;
};

export function addStorefrontCartItem(
  items: StorefrontCartLine[],
  item: StorefrontCartItemInput,
): StorefrontCartLine[] {
  const existingItem = items.find(
    (currentItem) =>
      currentItem.storeSlug === item.storeSlug &&
      currentItem.productId === item.productId,
  );

  if (!existingItem) {
    return [
      ...items,
      {
        ...item,
        isSelected: true,
      },
    ];
  }

  return items.map((currentItem) =>
    currentItem === existingItem
      ? {
          ...currentItem,
          quantity: currentItem.quantity + item.quantity,
        }
      : currentItem,
  );
}

export function updateStorefrontCartQuantity(
  items: StorefrontCartLine[],
  storeSlug: string,
  productId: string,
  quantity: number,
): StorefrontCartLine[] {
  if (quantity <= 0) {
    return items.filter(
      (item) =>
        item.storeSlug !== storeSlug || item.productId !== productId,
    );
  }

  return items.map((item) =>
    item.storeSlug === storeSlug && item.productId === productId
      ? { ...item, quantity }
      : item,
  );
}

export function addStorefrontCartItemWithinStock(
  items: StorefrontCartLine[],
  item: StorefrontCartItemInput,
  availableStock: number,
): StorefrontCartLine[] {
  if (availableStock <= 0) {
    return items;
  }

  return addStorefrontCartItem(items, item).map((currentItem) =>
    currentItem.storeSlug === item.storeSlug &&
    currentItem.productId === item.productId
      ? {
          ...currentItem,
          quantity: Math.min(currentItem.quantity, availableStock),
        }
      : currentItem,
  );
}