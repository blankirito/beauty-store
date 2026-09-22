type DatabaseStorePaymentMethod = {
  id: string;
  store_id: string;
  code: string;
  label: string;
  instructions: string | null;
  is_enabled: boolean;
  sort_order: number;
};

export type StorePaymentMethod = {
  id: string;
  storeId: string;
  code: string;
  label: string;
  instructions: string | null;
  isEnabled: boolean;
  sortOrder: number;
};

export function toStorePaymentMethod(
  method: DatabaseStorePaymentMethod,
): StorePaymentMethod {
  return {
    id: method.id,
    storeId: method.store_id,
    code: method.code,
    label: method.label,
    instructions: method.instructions,
    isEnabled: method.is_enabled,
    sortOrder: method.sort_order,
  };
}