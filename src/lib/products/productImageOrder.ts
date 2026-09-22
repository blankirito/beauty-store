export function getProductImageSortOrder(
  existingImageCount: number,
  newImageIndex: number,
) {
  return existingImageCount + newImageIndex;
}