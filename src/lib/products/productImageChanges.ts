type ProductImageChangesInput = {
  existingImagePaths: string[];
  desiredImagePaths: string[];
  primaryImagePath: string | null;
};

export function prepareProductImageChanges({
  existingImagePaths,
  desiredImagePaths,
  primaryImagePath,
}: ProductImageChangesInput) {
  const desiredImagePathSet = new Set(desiredImagePaths);

  const removedImagePaths = existingImagePaths.filter(
    (storagePath) => !desiredImagePathSet.has(storagePath),
  );

  return {
    removedImagePaths,
    images: desiredImagePaths.map((storagePath, index) => ({
      storagePath,
      sortOrder: index,
      isPrimary: storagePath === primaryImagePath,
    })),
  };
}