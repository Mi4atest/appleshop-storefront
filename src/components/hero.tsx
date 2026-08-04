"use client";

import { useState } from "react";
import { FilterDropdown } from "@/components/filter-dropdown";
import { FilterIcon, GridIcon, ListIcon } from "@/components/icons";
import { MobileFilterSheet } from "@/components/mobile-filter-sheet";
import type { PublicProduct } from "@/lib/api";
import type { CatalogCategory } from "@/lib/catalog";
import type { CatalogSort, CatalogView } from "@/lib/catalog-state";
import type {
  CatalogFacets,
  ProductFilterKey,
  ProductFilterState,
} from "@/lib/product-attrs";

const FILTER_PILLS: { id: CatalogCategory; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "used", label: "Б/у" },
  { id: "new", label: "Новые" },
];

type HeroProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
  filterProducts: PublicProduct[];
  facets: CatalogFacets;
  filters: ProductFilterState;
  query: string;
  visibleCount: number;
  sort: CatalogSort;
  view: CatalogView;
  onFilterChange: (key: ProductFilterKey, value: string | null) => void;
  onApplyFilters: (filters: ProductFilterState) => void;
  onResetFilters: () => void;
  onClearQuery: () => void;
  onSortChange: (sort: CatalogSort) => void;
  onViewChange: (view: CatalogView) => void;
};

export function Hero({
  category,
  onCategoryChange,
  filterProducts,
  facets,
  filters,
  query,
  visibleCount,
  sort,
  view,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onClearQuery,
  onSortChange,
  onViewChange,
}: HeroProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasFilters = Boolean(
    filters.model ||
      filters.storage ||
      filters.price ||
      filters.color ||
      filters.availability,
  );
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

  return (
    <section className="border-b border-neutral-200">
      <div className="px-3 py-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          <div
            className="flex w-full gap-2 md:w-auto md:shrink-0"
            role="group"
            aria-label="Категории"
          >
            {FILTER_PILLS.map((pill) => {
              const active = category === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onCategoryChange(pill.id)}
                  className={`flex-1 touch-manipulation rounded-full border border-black px-3 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-150 md:flex-none md:px-4 md:py-2 ${
                    active ? "bg-black text-white" : "bg-white text-black"
                  }`}
                  aria-pressed={active}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

            <div className="flex items-center justify-between gap-2 md:justify-end">
              <span className="mr-auto whitespace-nowrap text-[10px] uppercase tracking-[0.14em] text-neutral-500 md:mr-2">
                {visibleCount} шт.
              </span>
              <FilterDropdown
                label="Сортировка"
                value={sort}
                options={sortOptions}
                onChange={(value) =>
                  onSortChange((value ?? "recommended") as CatalogSort)
                }
                align="left"
              />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-1.5 px-2 py-2 text-[11px] font-bold uppercase tracking-[0.12em] md:hidden"
              >
                <FilterIcon />
                Фильтры{activeFilterCount ? ` · ${activeFilterCount}` : ""}
              </button>
              <div
                className="inline-flex border border-neutral-200"
                role="group"
                aria-label="Вид каталога"
              >
                <button
                  type="button"
                  onClick={() => onViewChange("grid")}
                  className={`inline-flex h-9 w-9 items-center justify-center ${
                    view === "grid" ? "bg-black text-white" : "bg-white text-black"
                  }`}
                  aria-label="Плитка"
                  aria-pressed={view === "grid"}
                >
                  <GridIcon />
                </button>
                <button
                  type="button"
                  onClick={() => onViewChange("list")}
                  className={`inline-flex h-9 w-9 items-center justify-center ${
                    view === "list" ? "bg-black text-white" : "bg-white text-black"
                  }`}
                  aria-label="Список"
                  aria-pressed={view === "list"}
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 hidden flex-wrap items-center justify-end gap-x-5 gap-y-2 border-t border-neutral-100 pt-3 md:flex">
            <FilterDropdown
              label="Модель"
              value={filters.model ?? null}
              options={facets.models}
              onChange={(value) => onFilterChange("model", value)}
              align="left"
            />
            <FilterDropdown
              label="Память"
              value={filters.storage ?? null}
              options={facets.storages}
              onChange={(value) => onFilterChange("storage", value)}
              align="left"
            />
            <FilterDropdown
              label="Цена"
              value={filters.price ?? null}
              options={facets.priceRanges}
              onChange={(value) => onFilterChange("price", value)}
              align="left"
            />
            <FilterDropdown
              label="Цвет"
              value={filters.color ?? null}
              options={facets.colors}
              onChange={(value) => onFilterChange("color", value)}
              align="left"
            />
            {category === "new" ? (
              <FilterDropdown
                label="Наличие"
                value={filters.availability ?? null}
                options={facets.availability}
                onChange={(value) => onFilterChange("availability", value)}
                align="left"
              />
            ) : null}
            {hasFilters ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500 underline-offset-2 hover:text-black hover:underline"
              >
                Сбросить
              </button>
            ) : null}
          </div>

          {query.trim() || activeChips.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-3">
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
      </div>

      {mobileFiltersOpen ? (
        <MobileFilterSheet
          open
          category={category}
          products={filterProducts}
          filters={filters}
          onClose={() => setMobileFiltersOpen(false)}
          onApply={(nextFilters) => {
            onApplyFilters(nextFilters);
            setMobileFiltersOpen(false);
          }}
        />
      ) : null}
    </section>
  );
}
