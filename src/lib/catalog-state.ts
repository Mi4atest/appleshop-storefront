import type { CatalogCategory } from "@/lib/catalog";
import { parseCatalogCategory } from "@/lib/catalog";
import type { ProductFilterState } from "@/lib/product-attrs";

export type CatalogSort =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "model"
  | "name";

export type CatalogView = "grid" | "list";

export type CatalogUiState = {
  category: CatalogCategory;
  filters: ProductFilterState;
  query: string;
  sort: CatalogSort;
  view: CatalogView;
};

const SORT_VALUES = new Set<CatalogSort>([
  "recommended",
  "price_asc",
  "price_desc",
  "model",
  "name",
]);

export function parseCatalogSort(value: string | null): CatalogSort {
  return value && SORT_VALUES.has(value as CatalogSort)
    ? (value as CatalogSort)
    : "recommended";
}

export function parseCatalogView(value: string | null): CatalogView {
  return value === "list" ? "list" : "grid";
}

export function readCatalogState(params: URLSearchParams): CatalogUiState {
  const availability = params.get("availability");
  return {
    category: parseCatalogCategory(params.get("category")),
    query: params.get("q") ?? "",
    sort: parseCatalogSort(params.get("sort")),
    view: parseCatalogView(params.get("view")),
    filters: {
      model: params.get("model"),
      storage: params.get("storage"),
      color: params.get("color"),
      price: params.get("price"),
      availability:
        availability === "available" || availability === "on_order"
          ? availability
          : null,
    },
  };
}

export function catalogStateToParams(state: CatalogUiState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.category !== "all") params.set("category", state.category);
  if (state.query.trim()) params.set("q", state.query.trim());
  if (state.sort !== "recommended") params.set("sort", state.sort);
  if (state.view !== "grid") params.set("view", state.view);
  if (state.filters.model) params.set("model", state.filters.model);
  if (state.filters.storage) params.set("storage", state.filters.storage);
  if (state.filters.color) params.set("color", state.filters.color);
  if (state.filters.price) params.set("price", state.filters.price);
  if (state.category === "new" && state.filters.availability) {
    params.set("availability", state.filters.availability);
  }
  return params;
}

export function catalogStateHref(
  pathname: string,
  state: CatalogUiState,
): string {
  const query = catalogStateToParams(state).toString();
  return query ? `${pathname}?${query}` : pathname;
}
