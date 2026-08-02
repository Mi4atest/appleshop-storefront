"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { getProductTitle, type PublicProduct } from "@/lib/api";
import { filterProductsByQuery } from "@/lib/search";

type SearchPanelProps = {
  open: boolean;
  onClose: () => void;
  products: PublicProduct[];
  query: string;
  onQueryChange: (query: string) => void;
};

export function SearchPanel({
  open,
  onClose,
  products,
  query,
  onQueryChange,
}: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo(
    () => filterProductsByQuery(products, query).slice(0, 24),
    [products, query],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col px-4 pb-6 pt-4 md:px-6">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
          <SearchIcon className="h-5 w-5 shrink-0 text-neutral-500" />
          <input
            ref={inputRef}
            id={titleId}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Поиск по названию…"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center"
            aria-label="Закрыть поиск"
          >
            <CloseIcon />
          </button>
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          {query.trim()
            ? `Найдено: ${results.length}${results.length === 24 ? "+" : ""}`
            : "Начните вводить модель, память или цвет"}
        </p>

        <ul className="mt-4 flex-1 space-y-1 overflow-y-auto">
          {results.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.id}`}
                onClick={onClose}
                className="flex items-baseline justify-between gap-3 border-b border-neutral-100 px-1 py-3"
              >
                <span className="min-w-0 break-words text-sm font-bold uppercase tracking-[0.08em]">
                  {getProductTitle(product)}
                </span>
                <span className="shrink-0 text-sm text-neutral-600">
                  {product.price ?? ""}
                </span>
              </Link>
            </li>
          ))}
          {query.trim() && results.length === 0 ? (
            <li className="py-10 text-center text-sm text-neutral-500">
              Ничего не найдено
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
