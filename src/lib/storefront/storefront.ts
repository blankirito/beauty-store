export type DatabaseStorefront = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Storefront = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export function toStorefront(store: DatabaseStorefront): Storefront {
  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    description: store.description ?? "",
  };
}