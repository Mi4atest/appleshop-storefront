"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Hero } from "@/components/hero";
import { NewItemsGrid } from "@/components/new-items-grid";
import { UsedItemsGrid } from "@/components/used-items-grid";
import type { PublicProduct } from "@/lib/api";
import {
  parseCatalogCategory,
  type CatalogCategory,
} from "@/lib/catalog";
import {
  buildCatalogFacets,
  filterProductsByFacets,
  hasActiveFacets,
  type ProductFilterState,
} from "@/lib/product-attrs";
import { sortNewProducts, sortUsedProducts } from "@/lib/product-sort";
import { filterProductsByQuery } from "@/lib/search";

export type { CatalogCategory };

type CatalogProps = {
  usedProducts: PublicProduct[];
  newProducts: PublicProduct[];
  usedError?: string | null;
  newError?: string | null;
};

type UiState = {
  category: CatalogCategory;
  filters: ProductFilterState;
  query: string;
};

function readFilters(params: URLSearchParams): ProductFilterState {
  return {
    model: params.get("model"),
    storage: params.get("storage"),
    color: params.get("color"),
    price: params.get("price"),
  };
}

function stateFromParams(params: URLSearchParams): UiState {
  return {
    category: parseCatalogCategory(params.get("category")),
    filters: readFilters(params),
    query: params.get("q") ?? "",
  };
}

export function Catalog({
  usedProducts,
  newProducts,
  usedError = null,
  newError = null,
}: CatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const catalogRef = useRef<HTMLDivElement | null>(null);

  const [ui, setUi] = useState<UiState>(() => stateFromParams(searchParams));
  const { category, filters, query } = ui;

  // Search panel in the header updates `q` via the router — keep local UI in sync.
  const urlQuery = searchParams.get("q") ?? "";
  const [seenUrlQuery, setSeenUrlQuery] = useState(urlQuery);
  if (urlQuery !== seenUrlQuery) {
    setSeenUrlQuery(urlQuery);
    setUi((current) => ({ ...current, query: urlQuery }));
  }

  // Back/forward: update UI from the browser location.
  useEffect(() => {
    const onPopState = () => {
      setUi(stateFromParams(new URLSearchParams(window.location.search)));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const allProducts = useMemo(
    () => [...usedProducts, ...newProducts],
    [usedProducts, newProducts],
  );
  const facets = useMemo(
    () => buildCatalogFacets(allProducts),
    [allProducts],
  );

  const facetActive = hasActiveFacets(filters);
  const hasQuery = query.trim().length > 0;

  const filteredUsed = useMemo(() => {
    let items = usedProducts;
    items = filterProductsByFacets(items, filters);
    items = filterProductsByQuery(items, query);
    return sortUsedProducts(items);
  }, [usedProducts, filters, query]);

  const filteredNew = useMemo(() => {
    let items = newProducts;
    items = filterProductsByFacets(items, filters);
    items = filterProductsByQuery(items, query);
    return sortNewProducts(items);
  }, [newProducts, filters, query]);

  const commit = (next: UiState) => {
    const params = new URLSearchParams();
    if (next.category !== "all") params.set("category", next.category);
    if (next.query.trim()) params.set("q", next.query.trim());
    if (next.filters.model) params.set("model", next.filters.model);
    if (next.filters.storage) params.set("storage", next.filters.storage);
    if (next.filters.color) params.set("color", next.filters.color);
    if (next.filters.price) params.set("price", next.filters.price);

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    setUi(next);
    window.history.replaceState(window.history.state, "", href);
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  const updateCategory = (next: CatalogCategory) => {
    commit({ category: next, filters, query });
  };

  const updateFilter = (
    key: keyof ProductFilterState,
    value: string | null,
  ) => {
    commit({
      category,
      query,
      filters: { ...filters, [key]: value },
    });
  };

  const resetFilters = () => {
    commit({
      category,
      query,
      filters: {
        model: null,
        storage: null,
        color: null,
        price: null,
      },
    });
  };

  const showUsed = category === "all" || category === "used";
  const showNew = category === "all" || category === "new";
  const visibleCount =
    (showUsed ? filteredUsed.length : 0) + (showNew ? filteredNew.length : 0);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <Hero
        category={category}
        onCategoryChange={updateCategory}
        facets={facets}
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
      />
      <div id="catalog" ref={catalogRef} className="scroll-mt-20 pt-5 md:pt-6">
        {hasQuery || facetActive ? (
          <p className="mb-6 px-4 text-center text-[11px] uppercase tracking-[0.16em] text-neutral-500 md:px-8">
            {hasQuery ? `Поиск: «${query.trim()}» · ` : null}
            {facetActive ? "Фильтры · " : null}
            {visibleCount} шт.
          </p>
        ) : null}

        {showUsed ? (
          <UsedItemsGrid
            products={filteredUsed}
            allUsedProducts={usedProducts}
            error={usedError}
          />
        ) : null}
        {showNew ? (
          <NewItemsGrid products={filteredNew} error={newError} />
        ) : null}
      </div>
    </div>
  );
}
