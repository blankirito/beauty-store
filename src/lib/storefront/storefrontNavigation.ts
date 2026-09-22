export type StorefrontNavigation = {
  homeHref: string;
  productsHref: string;
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
    cartHref: `${storePath}/cart`,
    profileHref: `${storePath}/profile`,
  };
}