"use client";

import { useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import type { PublicProduct } from "@/lib/api";
import {
  buildFreshArrivalIdSet,
  selectFreshArrivals,
} from "@/lib/fresh-arrivals";

type UsedItemsGridProps = {
  products: PublicProduct[];
  /**
   * Full used catalog. Fresh shelf/badges must be derived from this list,
   * otherwise search/filters recalculate the "wave" on a tiny subset and
   * falsely mark old items as НОВИНКА.
   */
  allUsedProducts?: PublicProduct[];
  view?: "grid" | "list";
  showFreshArrivals?: boolean;
  error?: string | null;
};

export function UsedItemsGrid({
  products,
  allUsedProducts,
  view = "grid",
  showFreshArrivals = true,
  error,
}: UsedItemsGridProps) {
  const freshSource = allUsedProducts ?? products;

  const freshProducts = useMemo(
    () => selectFreshArrivals(freshSource),
    [freshSource],
  );
  const freshIds = useMemo(
    () => buildFreshArrivalIdSet(freshSource),
    [freshSource],
  );

  // Only show the shelf on the unfiltered catalog; badges still use global ids.
  const showFreshShelf =
    !error &&
    showFreshArrivals &&
    freshProducts.length > 0 &&
    products.length === freshSource.length;

  return (
    <div className="min-w-0">
      {showFreshShelf ? (
        <section
          id="fresh-arrivals"
          className="scroll-mt-28 border-b border-neutral-100 px-3 pb-10 md:px-8 md:pb-12"
          aria-labelledby="fresh-arrivals-heading"
        >
          <h2
            id="fresh-arrivals-heading"
            className="mb-2 text-center text-sm font-bold uppercase tracking-[0.22em] md:text-base"
          >
            Свежие поступления
          </h2>
          <p className="mb-8 text-center text-[10px] uppercase tracking-[0.16em] text-neutral-500 md:mb-10">
            Недавно добавленные б/у устройства
          </p>
          <div
            className={
              view === "grid"
                ? "mx-auto grid max-w-7xl grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12 xl:grid-cols-4 xl:gap-x-10"
                : "mx-auto max-w-5xl"
            }
          >
            {freshProducts.map((product) => (
              <ProductCard
                key={`fresh-${product.id}`}
                product={product}
                isFreshArrival
                view={view}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section id="used" className="scroll-mt-28 px-3 pb-10 pt-10 md:px-8 md:pb-14 md:pt-12">
        <h2 className="mb-8 text-center text-sm font-bold uppercase tracking-[0.22em] md:mb-10 md:text-base">
          Б/у техника
        </h2>

        {error ? (
          <p className="text-center text-xs uppercase tracking-[0.18em] text-neutral-500">
            Не удалось загрузить б/у товары
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-xs uppercase tracking-[0.18em] text-neutral-500">
            Пока нет активных б/у товаров
          </p>
        ) : (
          <div
            className={
              view === "grid"
                ? "mx-auto grid max-w-7xl grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12 xl:grid-cols-4 xl:gap-x-10"
                : "mx-auto max-w-5xl"
            }
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFreshArrival={freshIds.has(product.id)}
                view={view}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
