export type CatalogCategory = "all" | "used" | "new";

export function parseCatalogCategory(value: string | null): CatalogCategory {
  if (value === "used" || value === "new" || value === "all") return value;
  return "all";
}
