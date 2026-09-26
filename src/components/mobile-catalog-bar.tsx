"use client";

import { useEffect, useRef, useState } from "react";
import { FilterDropdown } from "@/components/filter-dropdown";
import { FilterIcon } from "@/components/icons";
import { MobileFilterSheet } from "@/components/mobile-filter-sheet";
import type { PublicProduct } from "@/lib/api";
import type { CatalogCategory } from "@/lib/catalog";
import type { CatalogSort } from "@/lib/catalog-state";
import type {
  CatalogFacets,
  ProductFilterKey,
  ProductFilterState,
} from "@/lib/product-attrs";

type MobileCatalogBarProps = {
  category: CatalogCategory;
  filterProducts: PublicProduct[];
  facets: CatalogFacets;
  filters: ProductFilterState;
  query: string;
  sort: CatalogSort;
  onFilterChange: (key: ProductFilterKey, value: string | null) => void;
  onApplyFilters: (filters: ProductFilterState) => void;
  onClearQuery: () => void;
  onSortChange: (sort: CatalogSort) => void;
};

export function MobileCatalogBar({
  category,
  filterProducts,
  facets,
  filters,
  query,
  sort,
  onFilterChange,
  onApplyFilters,
  onClearQuery,
  onSortChange,
}: MobileCatalogBarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const activeFilterCount = [
    filters.model,
    filters.storage,
    filters.price,
    filters.color,
    filters.availability,
  ].filter(Boolean).length;

  const sortOptions = [
    {
      id: "recommended",
      label:
        category === "used"
          ? "Сначала свежие"
          : category === "new"
            ? "Рекомендуемая"
            : "По умолчанию",
    },
    { id: "model", label: "По модели" },
    { id: "price_asc", label: "Сначала дешевле" },
    { id: "price_desc", label: "Сначала дороже" },
    { id: "name", label: "По названию" },
  ];

  const chipLabel = (key: ProductFilterKey, value: string): string => {
    if (key === "model" || key === "storage") return value;
    const source =
      key === "price"
        ? facets.priceRanges
        : key === "color"
          ? facets.colors
          : facets.availability;
    return source.find((option) => option.id === value)?.label ?? value;
  };

  const activeChips: Array<[ProductFilterKey, string]> = [];
  if (filters.model) activeChips.push(["model", filters.model]);
  if (filters.storage) activeChips.push(["storage", filters.storage]);
  if (filters.price) activeChips.push(["price", filters.price]);
  if (filters.color) activeChips.push(["color", filters.color]);
  if (filters.availability) {
    activeChips.push(["availability", filters.availability]);
  }

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const headerRaw = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-h")
      .trim();
    const headerH = Number.parseFloat(headerRaw) || 76;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const above =
          !entry.isIntersecting && entry.boundingClientRect.top <= headerH + 1;
        setStuck(above);
      },
      { rootMargin: `-${headerH}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const apply = () => setBarHeight(bar.offsetHeight);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [query, activeChips.length]);

  return (
    <div className="md:hidden">
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      {stuck ? <div style={{ height: barHeight }} aria-hidden="true" /> : null}
      <div
        ref={barRef}
        className={`z-40 border-b border-neutral-200 bg-white ${
          stuck ? "fixed inset-x-0" : "relative"
        }`}
        style={stuck ? { top: "var(--header-h, 4.75rem)" } : undefined}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex min-h-11 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
          >
            <FilterIcon />
            Фильтры{activeFilterCount ? ` · ${activeFilterCount}` : ""}
          </button>
          <FilterDropdown
            label="Сортировка"
            value={sort}
            options={sortOptions}
            onChange={(value) =>
              onSortChange((value ?? "recommended") as CatalogSort)
            }
            align="left"
          />
        </div>
        {query.trim() || activeChips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 px-3 pb-2">
            {query.trim() ? (
              <button
                type="button"
                onClick={onClearQuery}
                className="inline-flex items-center gap-2 bg-neutral-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
              >
                Поиск: «{query.trim()}» <span aria-hidden="true">×</span>
              </button>
            ) : null}
            {activeChips.map(([key, value]) => (
              <button
                type="button"
                key={key}
                onClick={() => onFilterChange(key, null)}
                className="inline-flex items-center gap-2 bg-neutral-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
              >
                {chipLabel(key, value)} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {filtersOpen ? (
        <MobileFilterSheet
          open
          category={category}
          products={filterProducts}
          filters={filters}
          onClose={() => setFiltersOpen(false)}
          onApply={(nextFilters) => {
            onApplyFilters(nextFilters);
            setFiltersOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
