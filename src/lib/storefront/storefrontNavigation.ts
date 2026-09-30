export type StorefrontNavigation = {
  homeHref: string;
  productsHref: string;
  newArrivalsHref: string;
  searchHref: string;
  ordersHref: string;
  cartHref: string;
  profileHref: string;
  startStoreHref: string;
};

export function getStorefrontNavigation(
  storeSlug: string,
): StorefrontNavigation {
  const storePath = `/store/${storeSlug}`;

  return {
    homeHref: storePath,
    productsHref: `${storePath}#products`,
    newArrivalsHref: `${storePath}/collection/new-arrivals`,
    searchHref: `${storePath}/search`,
    ordersHref: `${storePath}/orders`,
    cartHref: `${storePath}/cart`,
    profileHref: `${storePath}/profile`,
    startStoreHref: "/merchant/register",
  };
}