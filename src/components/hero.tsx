"use client";

import { FilterDropdown } from "@/components/filter-dropdown";
import type { CatalogCategory } from "@/lib/catalog";
import type {
  CatalogFacets,
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
  facets: CatalogFacets;
  filters: ProductFilterState;
  onFilterChange: (key: keyof ProductFilterState, value: string | null) => void;
  onResetFilters: () => void;
};

export function Hero({
  category,
  onCategoryChange,
  facets,
  filters,
  onFilterChange,
  onResetFilters,
}: HeroProps) {
  const modelOptions = facets.models.map((model) => ({
    id: model,
    label: model,
  }));
  const storageOptions = facets.storages.map((storage) => ({
    id: storage,
    label: storage,
  }));
  const priceOptions = facets.priceRanges.map((range) => ({
    id: range.id,
    label: range.label,
  }));
  const colorOptions = facets.colors.map((color) => ({
    id: color.id,
    label: `${color.emoji} ${color.label}`,
  }));

  const hasFilters = Boolean(
    filters.model || filters.storage || filters.price || filters.color,
  );

  return (
    <section className="border-b border-neutral-200">
      <div className="px-4 py-4 md:px-6 md:py-3 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
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

          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3 md:flex md:w-auto md:flex-wrap md:items-center md:justify-end md:gap-x-5 md:gap-y-2">
            <FilterDropdown
              label="Модель"
              value={filters.model ?? null}
              options={modelOptions}
              onChange={(value) => onFilterChange("model", value)}
              align="left"
            />
            <FilterDropdown
              label="Память"
              value={filters.storage ?? null}
              options={storageOptions}
              onChange={(value) => onFilterChange("storage", value)}
              align="left"
            />
            <FilterDropdown
              label="Цена"
              value={filters.price ?? null}
              options={priceOptions}
              onChange={(value) => onFilterChange("price", value)}
              align="left"
            />
            <FilterDropdown
              label="Цвет"
              value={filters.color ?? null}
              options={colorOptions}
              onChange={(value) => onFilterChange("color", value)}
              align="left"
            />
            {hasFilters ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="col-span-2 justify-self-center text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500 underline-offset-2 hover:text-black hover:underline md:col-span-1 md:ml-1"
              >
                Сбросить
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
