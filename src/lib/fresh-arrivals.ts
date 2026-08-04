import type { PublicProduct } from "@/lib/api";

/** Items within this window of the newest arrival form one intake wave. */
export const FRESH_ARRIVAL_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Hide the shelf/badges when the newest remaining item is older than this.
 * Prevents an older wave from resurfacing after the latest wave sells out.
 */
export const MAX_FRESH_AGE_MS = 3 * 24 * 60 * 60 * 1000;

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
 * Fresh used arrivals = the latest intake wave (entire wave, newest first).
 *
 * Wave = dated used items within 24h of the newest `created_at`.
 * If that newest item is older than {@link MAX_FRESH_AGE_MS}, nothing is fresh
 * (no shelf, no badges) — older waves do not get promoted.
 * Individually, anything still younger than 24h also counts (min visibility).
 */
export function selectFreshArrivals(
  products: PublicProduct[],
  now: number = Date.now(),
): PublicProduct[] {
  const dated = toDated(products);
  if (dated.length === 0) return [];

  const latestTime = dated[0].time;
  if (now - latestTime > MAX_FRESH_AGE_MS) return [];

  const fresh = dated.filter((entry) => {
    const inLatestWave = latestTime - entry.time <= FRESH_ARRIVAL_WINDOW_MS;
    const withinMinWindow = now - entry.time < FRESH_ARRIVAL_WINDOW_MS;
    return inLatestWave || withinMinWindow;
  });

  return fresh.map((entry) => entry.product);
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
