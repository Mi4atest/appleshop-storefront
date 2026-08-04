"use client";

import { useEffect, useMemo, useState } from "react";
import { CloseIcon } from "@/components/icons";
import type { PublicProduct } from "@/lib/api";
import type { CatalogCategory } from "@/lib/catalog";
import {
  buildCatalogFacets,
  emptyProductFilters,
  filterProductsByFacets,
  hasActiveFacets,
  reconcileProductFilters,
  type FacetOption,
  type ProductFilterKey,
  type ProductFilterState,
} from "@/lib/product-attrs";

type MobileFilterSheetProps = {
  open: boolean;
  category: CatalogCategory;
  products: PublicProduct[];
  filters: ProductFilterState;
  onClose: () => void;
  onApply: (filters: ProductFilterState) => void;
};

type MobileSelectProps = {
  label: string;
  value: string | null | undefined;
  options: FacetOption[];
  onChange: (value: string | null) => void;
};

function MobileSelect({
  label,
  value,
  options,
  onChange,
}: MobileSelectProps) {
  return (
    <label className="block border-b border-neutral-100 py-3">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="w-full bg-white py-2 text-sm font-medium outline-none"
      >
        <option value="">Все</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </label>
  );
}

export function MobileFilterSheet({
  open,
  category,
  products,
  filters,
  onClose,
  onApply,
}: MobileFilterSheetProps) {
  const [draft, setDraft] = useState<ProductFilterState>(filters);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const facets = useMemo(
    () => buildCatalogFacets(products, draft),
    [products, draft],
  );
  const resultCount = useMemo(
    () => filterProductsByFacets(products, draft).length,
    [products, draft],
  );

  if (!open) return null;

  const updateDraft = (key: ProductFilterKey, value: string | null) => {
    setDraft((current) =>
      reconcileProductFilters(
        products,
        { ...current, [key]: value } as ProductFilterState,
        key,
        category === "new",
      ),
    );
  };

  return (
    <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label="Закрыть фильтры"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em]">
              Фильтры
            </h2>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              Найдено: {resultCount}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center"
            onClick={onClose}
            aria-label="Закрыть фильтры"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          <MobileSelect
            label="Модель"
            value={draft.model}
            options={facets.models}
            onChange={(value) => updateDraft("model", value)}
          />
          <MobileSelect
            label="Память"
            value={draft.storage}
            options={facets.storages}
            onChange={(value) => updateDraft("storage", value)}
          />
          <MobileSelect
            label="Цена"
            value={draft.price}
            options={facets.priceRanges}
            onChange={(value) => updateDraft("price", value)}
          />
          <MobileSelect
            label="Цвет"
            value={draft.color}
            options={facets.colors}
            onChange={(value) => updateDraft("color", value)}
          />
          {category === "new" ? (
            <MobileSelect
              label="Наличие"
              value={draft.availability}
              options={facets.availability}
              onChange={(value) => updateDraft("availability", value)}
            />
          ) : null}
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-neutral-200 p-4">
          <button
            type="button"
            onClick={() => setDraft(emptyProductFilters())}
            disabled={!hasActiveFacets(draft)}
            className="border border-neutral-300 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] disabled:opacity-35"
          >
            Сбросить
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="bg-black px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
          >
            Показать {resultCount}
          </button>
        </div>
      </div>
    </div>
  );
}
