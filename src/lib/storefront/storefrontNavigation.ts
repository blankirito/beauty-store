export type StorefrontNavigation = {
  homeHref: string;
  productsHref: string;
  searchHref: string;
  ordersHref: string;
  cartHref: string;
  profileHref: string;
};

export function getStorefrontNavigation(
  storeSlug: string,
): StorefrontNavigation {
  const storePath = `/store/${storeSlug}`;

  return {
    homeHref: storePath,
    productsHref: `${storePath}#products`,
    searchHref: `${storePath}/search`,
    ordersHref: `${storePath}/orders`,
    cartHref: `${storePath}/cart`,
    profileHref: `${storePath}/profile`,
  };
}