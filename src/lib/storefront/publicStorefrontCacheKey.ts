export function getPublicStorefrontCacheKey(storeSlug: string) {
  return `public-storefront:${storeSlug.trim().toLowerCase()}`;
}
