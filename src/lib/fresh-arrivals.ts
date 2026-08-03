import type { PublicProduct } from "@/lib/api";

/** Items within this window of the newest arrival form one intake wave. */
export const FRESH_ARRIVAL_WINDOW_MS = 24 * 60 * 60 * 1000;

/** Cap so a bulk catalog import does not mark the whole grid as fresh. */
export const FRESH_ARRIVAL_LIMIT = 12;

type DatedProduct = {
  product: PublicProduct;
  time: number;
};

function toDated(products: PublicProduct[]): DatedProduct[] {
  return products
    .map((product) => {
      const time = product.created_at ? Date.parse(product.created_at) : Number.NaN;
      return { product, time };
    })
    .filter((entry) => Number.isFinite(entry.time))
    .sort(
      (a, b) => b.time - a.time || b.product.id - a.product.id,
    );
}

/**
 * Fresh used arrivals = the latest intake wave (newest first, capped).
 *
 * Wave = dated used items within 24h of the newest `created_at`.
 * The wave stays until the next intake: a product more than 24h after the
 * previous newest. Until then the shelf/badge remain even if several days pass.
 * Individually, anything still younger than 24h also counts (min visibility).
 */
export function selectFreshArrivals(
  products: PublicProduct[],
  now: number = Date.now(),
): PublicProduct[] {
  const dated = toDated(products);
  if (dated.length === 0) return [];

  const latestTime = dated[0].time;

  const fresh = dated.filter((entry) => {
    const inLatestWave = latestTime - entry.time <= FRESH_ARRIVAL_WINDOW_MS;
    const withinMinWindow = now - entry.time < FRESH_ARRIVAL_WINDOW_MS;
    return inLatestWave || withinMinWindow;
  });

  return fresh.slice(0, FRESH_ARRIVAL_LIMIT).map((entry) => entry.product);
}

export function buildFreshArrivalIdSet(
  products: PublicProduct[],
  now: number = Date.now(),
): Set<number> {
  return new Set(selectFreshArrivals(products, now).map((product) => product.id));
}

export function isFreshArrival(
  product: PublicProduct,
  usedCatalog: PublicProduct[],
  now: number = Date.now(),
): boolean {
  if (product.kind !== "used") return false;
  return buildFreshArrivalIdSet(usedCatalog, now).has(product.id);
}
