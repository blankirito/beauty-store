export function getPublicProductImageUrl(
  supabaseUrl: string,
  storagePath: string,
) {
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/product-images/${storagePath}`;
}