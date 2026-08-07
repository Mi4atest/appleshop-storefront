"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { shortModelChipLabel } from "@/lib/product-attrs";
import type { FacetOption } from "@/lib/product-attrs";
import { chipThumbForModel } from "@/lib/product-media";

type ModelQuickFiltersProps = {
  models: FacetOption[];
  selected: string | null;
  onSelect: (modelId: string | null) => void;
};

function ChevronLeftIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M10 3.5L5.5 8 10 12.5" />
    </svg>
  );
}

function ChevronRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 3.5L10.5 8 6 12.5" />
    </svg>
  );
}

export function ModelQuickFilters({
  models,
  selected,
  onSelect,
}: ModelQuickFiltersProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sorted = [...models].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label, "ru"),
  );

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(max > 2 && el.scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(() => updateScrollState());
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, models.length, selected]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      event.preventDefault();
      el.scrollBy({ left: event.deltaY, behavior: "auto" });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [models.length]);

  if (models.length === 0) return null;

  const scrollByAmount = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(240, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const arrowClass =
    "absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-sm transition-opacity hover:border-neutral-400 md:inline-flex";

  return (
    <div className="relative" role="group" aria-label="Быстрый фильтр по модели">
      {canScrollLeft ? (
        <button
          type="button"
          className={`${arrowClass} left-0`}
          aria-label="Прокрутить модели влево"
          onClick={() => scrollByAmount(-1)}
        >
          <ChevronLeftIcon />
        </button>
      ) : null}

      {canScrollRight ? (
        <button
          type="button"
          className={`${arrowClass} right-0`}
          aria-label="Прокрутить модели вправо"
          onClick={() => scrollByAmount(1)}
        >
          <ChevronRightIcon />
        </button>
      ) : null}

      <div
        ref={scrollerRef}
        className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] md:mx-0 md:gap-2.5 md:px-10 md:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`inline-flex shrink-0 touch-manipulation items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-tight transition-colors md:px-3.5 md:py-2 ${
            !selected
              ? "border-black bg-black text-white"
              : "border-neutral-200 bg-neutral-100 text-black hover:border-neutral-400"
          }`}
          aria-pressed={!selected}
        >
          Все
        </button>

        {sorted.map((option) => {
          const active = selected === option.id;
          const short = shortModelChipLabel(option.label);
          const thumb = chipThumbForModel(option.label);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(active ? null : option.id)}
              className={`inline-flex shrink-0 touch-manipulation items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-xs font-bold tracking-tight transition-colors md:py-2 md:pl-2 md:pr-3.5 ${
                active
                  ? "border-black bg-black text-white"
                  : "border-neutral-200 bg-neutral-100 text-black hover:border-neutral-400"
              }`}
              aria-pressed={active}
            >
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white md:h-8 md:w-8">
                <Image
                  src={thumb}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-contain p-0.5"
                />
              </span>
              <span className="whitespace-nowrap">
                {short}{" "}
                <span className={active ? "text-white/70" : "text-neutral-500"}>
                  ({option.count})
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
