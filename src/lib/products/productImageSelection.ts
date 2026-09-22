export function getInitialProductImagePath(
  imagePaths: string[],
  primaryImagePath: string | null,
) {
  return primaryImagePath ?? imagePaths[0] ?? null;
}