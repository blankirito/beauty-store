export function prepareProductArchive() {
  return {
    status: "archived" as const,
    is_active: false,
  };
}