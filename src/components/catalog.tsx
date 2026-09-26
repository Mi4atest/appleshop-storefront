"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Hero } from "@/components/hero";
import { MobileCatalogBar } from "@/components/mobile-catalog-bar";
import { MobileHomeIntro } from "@/components/mobile-home-intro";
import { NewItemsGrid } from "@/components/new-items-grid";
import { UsedItemsGrid } from "@/components/used-items-grid";
import type { PublicProduct } from "@/lib/api";
import type { CatalogCategory } from "@/lib/catalog";
import {
  catalogStateHref,
  catalogUiEqual,
  readCatalogState,
  type CatalogSort,
  type CatalogUiState,
  type CatalogView,
} from "@/lib/catalog-state";
import { selectFreshArrivals } from "@/lib/fresh-arrivals";
import {
  buildCatalogFacets,
  emptyProductFilters,
  filterProductsByFacets,
  hasActiveFacets,
  productFiltersEqual,
  reconcileProductFilters,
  type ProductFilterKey,
  type ProductFilterState,
} from "@/lib/product-attrs";
import { sortProducts } from "@/lib/product-sort";
import { filterProductsByQuery } from "@/lib/search";

export type { CatalogCategory };

type CatalogProps = {
  usedProducts: PublicProduct[];
  newProducts: PublicProduct[];
  usedError?: string | null;
  newError?: string | null;
};

export function Catalog({
  usedProducts,
  newProducts,
  usedError = null,
  newError = null,
}: CatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramsKey = searchParams.toString();
  const parsedUi = useMemo(
    () => readCatalogState(new URLSearchParams(paramsKey)),
    [paramsKey],
  );
  const [draft, setDraft] = useState<CatalogUiState | null>(null);

  useEffect(() => {
    if (!draft) return;
    if (catalogUiEqual(parsedUi, draft)) setDraft(null);
  }, [draft, parsedUi]);

  const rawUi = draft ?? parsedUi;
  const { category, query, sort, view } = rawUi;

  const allProducts = useMemo(
    () => [...usedProducts, ...newProducts],
    [usedProducts, newProducts],
  );

  const categoryProducts = useMemo(() => {
    if (category === "used") return usedProducts;
    if (category === "new") return newProducts;
    return allProducts;
  }, [category, usedProducts, newProducts, allProducts]);

  const queryScopedProducts = useMemo(
    () => filterProductsByQuery(categoryProducts, query),
    [categoryProducts, query],
  );

  const sanitizedFilters = useMemo(
    () =>
      reconcileProductFilters(
        categoryProducts,
        rawUi.filters,
        undefined,
        category === "new",
      ),
    [categoryProducts, rawUi.filters, category],
  );

  const ui = useMemo<CatalogUiState>(
    () => ({ ...rawUi, filters: sanitizedFilters }),
    [rawUi, sanitizedFilters],
  );
  const filters = ui.filters;

  const commit = useCallback(
    (next: CatalogUiState) => {
      setDraft(next);
      router.replace(catalogStateHref(pathname, next), { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    if (!productFiltersEqual(parsedUi.filters, sanitizedFilters)) {
      router.replace(catalogStateHref(pathname, ui), { scroll: false });
    }
  }, [parsedUi.filters, sanitizedFilters, pathname, router, ui]);

  const facets = useMemo(
    () => buildCatalogFacets(queryScopedProducts, filters),
    [queryScopedProducts, filters],
  );

  const facetActive = hasActiveFacets(filters);
  const hasQuery = query.trim().length > 0;

  const filteredUsed = useMemo(() => {
    let items = usedProducts;
    items = filterProductsByFacets(items, filters);
    items = filterProductsByQuery(items, query);
    return sortProducts(items, sort, "used");
  }, [usedProducts, filters, query, sort]);

  const filteredNew = useMemo(() => {
    let items = newProducts;
    items = filterProductsByFacets(items, filters);
    items = filterProductsByQuery(items, query);
    return sortProducts(items, sort, "new");
  }, [newProducts, filters, query, sort]);

  const updateCategory = (next: CatalogCategory) => {
    const nextProducts =
      next === "used"
        ? usedProducts
        : next === "new"
          ? newProducts
          : allProducts;
    const nextFilters = reconcileProductFilters(
      nextProducts,
      filters,
      undefined,
      next === "new",
    );
    commit({ ...ui, category: next, filters: nextFilters });
  };

  const updateFilter = (
    key: ProductFilterKey,
    value: string | null,
  ) => {
    const nextFilters = reconcileProductFilters(
      categoryProducts,
      { ...filters, [key]: value } as ProductFilterState,
      key,
      category === "new",
    );
    commit({ ...ui, filters: nextFilters });
  };

  const resetFilters = () => {
    commit({ ...ui, filters: emptyProductFilters() });
  };

  const applyFilters = (nextFilters: ProductFilterState) => {
    commit({
      ...ui,
      filters: reconcileProductFilters(
        categoryProducts,
        nextFilters,
        undefined,
        category === "new",
      ),
    });
  };

  const clearQuery = () => commit({ ...ui, query: "" });
  const updateSort = (nextSort: CatalogSort) =>
    commit({ ...ui, sort: nextSort });
  const updateView = (nextView: CatalogView) =>
    commit({ ...ui, view: nextView });

  const showUsed = category === "all" || category === "used";
  const showNew = category === "all" || category === "new";
  const visibleCount =
    (showUsed ? filteredUsed.length : 0) + (showNew ? filteredNew.length : 0);
  const hasNarrowing = hasQuery || facetActive;
  const noResults = hasNarrowing && visibleCount === 0;
  const freshProducts = useMemo(
    () => selectFreshArrivals(usedProducts),
    [usedProducts],
  );
  const showFreshShelf = showUsed && !hasNarrowing && !usedError;

  return (
    <div className="min-w-0 overflow-x-hidden">
      <div className="hidden md:block">
        <Hero
          category={category}
          onCategoryChange={updateCategory}
          facets={facets}
          filters={filters}
          query={query}
          visibleCount={visibleCount}
          sort={sort}
          view={view}
          onFilterChange={updateFilter}
          onResetFilters={resetFilters}
          onClearQuery={clearQuery}
          onSortChange={updateSort}
          onViewChange={updateView}
        />
      </div>
      <MobileHomeIntro
        category={category}
        onCategoryChange={updateCategory}
        hasUsed={usedProducts.length > 0 && !usedError}
        hasNew={newProducts.length > 0 && !newError}
        facets={facets}
        selectedModel={filters.model ?? null}
        onModelSelect={(modelId) => updateFilter("model", modelId)}
        freshProducts={freshProducts}
        showFresh={showFreshShelf}
      />
      <MobileCatalogBar
        category={category}
        filterProducts={queryScopedProducts}
        facets={facets}
        filters={filters}
        query={query}
        sort={sort}
        onFilterChange={updateFilter}
        onApplyFilters={applyFilters}
        onClearQuery={clearQuery}
        onSortChange={updateSort}
      />
      <div
        id="catalog"
        className="scroll-mt-[calc(var(--header-h,4.75rem)+3.25rem)] pt-5 md:scroll-mt-20 md:pt-6"
      >
        {noResults ? (
          <div className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center px-4 pb-16 text-center">
            <h2 className="text-base font-bold uppercase tracking-[0.18em]">
              Ничего не найдено
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Попробуйте изменить параметры или очистить условия поиска.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {hasQuery ? (
                <button
                  type="button"
                  onClick={clearQuery}
                  className="border border-black px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em]"
                >
                  Очистить поиск
                </button>
              ) : null}
              {facetActive ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="bg-black px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
                >
                  Сбросить фильтры
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {!noResults && showUsed && (!hasNarrowing || filteredUsed.length > 0) ? (
          <UsedItemsGrid
            products={filteredUsed}
            allUsedProducts={usedProducts}
            view={view}
            showFreshArrivals={!hasNarrowing}
            error={usedError}
          />
        ) : null}
        {!noResults && showNew && (!hasNarrowing || filteredNew.length > 0) ? (
          <NewItemsGrid
            products={filteredNew}
            view={view}
            error={newError}
          />
        ) : null}
      </div>
    </div>
  );
}
