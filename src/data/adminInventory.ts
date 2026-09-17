export type InventoryStatus = "Active" | "Draft";

export type InventoryDetails = {
  stock: number;
  status: InventoryStatus;
};

export const inventoryByProductId: Record<number, InventoryDetails> = {
  1: { stock: 84, status: "Active" },
  2: { stock: 4, status: "Active" },
  3: { stock: 12, status: "Draft" },
  4: { stock: 124, status: "Active" },
  5: { stock: 2, status: "Active" },
};

export function getInventoryDetails(productId: number): InventoryDetails {
  return inventoryByProductId[productId] ?? {
    stock: 20,
    status: "Active",
  };
}