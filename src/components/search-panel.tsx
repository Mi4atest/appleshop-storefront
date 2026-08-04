"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { getProductTitle, type PublicProduct } from "@/lib/api";
import { filterProductsByQuery } from "@/lib/search";

const PREVIEW_LIMIT = 24;

type SearchPanelProps = {
  open: boolean;
  onClose: () => void;
  products: PublicProduct[];
  query: string;
  onSubmit: (query: string) => void;
};

export function SearchPanel({
  open,
  onClose,
  products,
  query,
  onSubmit,
}: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();
  const [draft, setDraft] = useState(query);

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

  const results = useMemo(() => {
    if (!draft.trim()) return [];
    return filterProductsByQuery(products, draft);
  }, [products, draft]);

  const preview = results.slice(0, PREVIEW_LIMIT);
  const hasMore = results.length > PREVIEW_LIMIT;

  if (!open) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(draft);
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col px-4 pb-6 pt-4 md:px-6">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-b border-neutral-200 pb-3"
        >
          <SearchIcon className="h-5 w-5 shrink-0 text-neutral-500" />
          <input
            ref={inputRef}
            id={titleId}
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Модель, память или цвет…"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
          />
          <button
            type="submit"
            className="shrink-0 px-2 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
          >
            Найти
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center"
            aria-label="Закрыть поиск"
          >
            <CloseIcon />
          </button>
        </form>

        <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          {draft.trim()
            ? results.length === 0
              ? "Ничего не найдено"
              : `Найдено: ${results.length}${hasMore ? "+" : ""} · Enter или «Найти» — карточки в каталоге`
            : "Начните вводить или нажмите Enter / «Найти»"}
        </p>

        <ul className="mt-4 flex-1 space-y-1 overflow-y-auto">
          {preview.map((product) => (
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
          {draft.trim() && results.length === 0 ? (
            <li className="py-10 text-center text-sm text-neutral-500">
              Ничего не найдено
            </li>
          ) : null}
          {hasMore ? (
            <li className="py-4 text-center">
              <button
                type="button"
                onClick={() => onSubmit(draft)}
                className="text-[11px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
              >
                Показать все {results.length} в каталоге
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
