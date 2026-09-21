export type DatabaseProductStatus = "active" | "draft" | "archived";

export type ProductStatusLabel = "Active" | "Draft" | "Archived";

const databaseStatusByLabel: Record<
  ProductStatusLabel,
  DatabaseProductStatus
> = {
  Active: "active",
  Draft: "draft",
  Archived: "archived",
};

const displayStatusByDatabase: Record<
  DatabaseProductStatus,
  ProductStatusLabel
> = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
};

export function toDatabaseProductStatus(
  label: ProductStatusLabel,
): DatabaseProductStatus {
  return databaseStatusByLabel[label];
}

export function toDisplayProductStatus(
  status: DatabaseProductStatus,
): ProductStatusLabel {
  return displayStatusByDatabase[status];
}