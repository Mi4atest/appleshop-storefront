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

const CATEGORY_CIRCLES: { id: CatalogCategory; label: string }[] = [
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
      <div className="hidden border-b border-neutral-200 px-6 py-3 md:block">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em]">
          Доставка и самовывоз в Кирове
        </p>
      </div>

      <div className="px-4 pb-6 pt-6 md:px-8 md:pb-8 md:pt-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex w-full max-w-md gap-2 md:hidden">
            {FILTER_PILLS.map((pill) => {
              const active = category === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onCategoryChange(pill.id)}
                  className={`flex-1 touch-manipulation rounded-full border border-black px-3 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-150 ${
                    active ? "bg-black text-white" : "bg-white text-black"
                  }`}
                  aria-pressed={active}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid w-full max-w-lg grid-cols-2 gap-x-4 gap-y-3 md:mt-0 md:hidden">
            <FilterDropdown
              label="Модель"
              value={filters.model ?? null}
              options={modelOptions}
              onChange={(value) => onFilterChange("model", value)}
            />
            <FilterDropdown
              label="Цена"
              value={filters.price ?? null}
              options={priceOptions}
              onChange={(value) => onFilterChange("price", value)}
            />
            <FilterDropdown
              label="Память"
              value={filters.storage ?? null}
              options={storageOptions}
              onChange={(value) => onFilterChange("storage", value)}
            />
            <FilterDropdown
              label="Цвет"
              value={filters.color ?? null}
              options={colorOptions}
              onChange={(value) => onFilterChange("color", value)}
            />
          </div>

          <div className="hidden w-full md:block">
            <div className="flex items-center justify-center gap-10 lg:gap-14">
              {CATEGORY_CIRCLES.map((item) => {
                const active = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onCategoryChange(item.id)}
                    className="flex touch-manipulation flex-col items-center gap-3"
                    aria-pressed={active}
                  >
                    <span
                      className={`flex h-24 w-24 items-center justify-center rounded-full border text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-150 lg:h-28 lg:w-28 ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-neutral-100 text-black"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-4 gap-4 border-t border-neutral-200 pt-5">
              <FilterDropdown
                label="Модель"
                value={filters.model ?? null}
                options={modelOptions}
                onChange={(value) => onFilterChange("model", value)}
              />
              <FilterDropdown
                label="Память"
                value={filters.storage ?? null}
                options={storageOptions}
                onChange={(value) => onFilterChange("storage", value)}
              />
              <FilterDropdown
                label="Цена"
                value={filters.price ?? null}
                options={priceOptions}
                onChange={(value) => onFilterChange("price", value)}
              />
              <FilterDropdown
                label="Цвет"
                value={filters.color ?? null}
                options={colorOptions}
                onChange={(value) => onFilterChange("color", value)}
              />
            </div>
          </div>

          {hasFilters ? (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500 underline-offset-2 hover:text-black hover:underline"
            >
              Сбросить фильтры
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
