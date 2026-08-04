import type { PublicProduct } from "@/lib/api";
import type { CatalogSort } from "@/lib/catalog-state";
import {
  extractStorage,
  getProductAvailability,
  parsePriceValue,
} from "@/lib/product-attrs";

const naturalCollator = new Intl.Collator("ru", {
  numeric: true,
  sensitivity: "base",
});

function productName(product: PublicProduct): string {
  return `${product.name} ${product.display_label ?? ""}`.trim();
}

function normalizedName(product: PublicProduct): string {
  return productName(product).toLowerCase();
}

type ModelKey = [family: number, generation: number, variant: number];

function generationFrom(name: string, pattern: RegExp): number {
  const match = name.match(pattern);
  return match ? Number(match[1]) : 0;
}

/**
 * Natural catalog hierarchy:
 * family → newest generation → premium/base variant.
 */
function modelKey(product: PublicProduct): ModelKey {
  const name = normalizedName(product);

  if (name.includes("iphone")) {
    const generation =
      generationFrom(name, /iphone\s*(\d+)/) ||
      (name.includes("iphone air") ? 17 : 0);
    let variant = 3;
    if (name.includes("pro max")) variant = 0;
    else if (name.includes("pro")) variant = 1;
    else if (name.includes("plus") || name.includes("air")) variant = 2;
    else if (new RegExp(`iphone\\s*${generation}e\\b`).test(name)) variant = 4;
    return [0, -generation, variant];
  }

  if (name.includes("ipad")) {
    const generation = generationFrom(name, /ipad[^\d]*(\d+)/);
    let variant = 3;
    if (name.includes("pro")) variant = 0;
    else if (name.includes("air")) variant = 1;
    else if (name.includes("mini")) variant = 2;
    return [1, -generation, variant];
  }

  if (name.includes("watch")) {
    const generation =
      generationFrom(name, /(?:series|watch)\s*(\d+)/) ||
      generationFrom(name, /\bse[\s-]?(\d+)/);
    let variant = 1;
    if (name.includes("ultra")) variant = 0;
    else if (/\bse\b|\bse[\s-]?\d/.test(name)) variant = 2;
    return [2, -generation, variant];
  }

  if (name.includes("airpods")) {
    const generation = generationFrom(name, /airpods[^\d]*(\d+)/);
    let variant = 2;
    if (name.includes("pro")) variant = 0;
    else if (name.includes("max")) variant = 1;
    return [3, -generation, variant];
  }

  return [9, 0, 0];
}

function compareModel(a: PublicProduct, b: PublicProduct): number {
  const left = modelKey(a);
  const right = modelKey(b);
  for (let index = 0; index < left.length; index += 1) {
    const difference = left[index] - right[index];
    if (difference !== 0) return difference;
  }
  return naturalCollator.compare(productName(a), productName(b));
}

function storageRank(product: PublicProduct): number {
  const storage = extractStorage(product);
  if (!storage) return Number.POSITIVE_INFINITY;
  const amount = Number(storage.replace(/\D/g, ""));
  if (!Number.isFinite(amount)) return Number.POSITIVE_INFINITY;
  return storage.includes("TB") ? amount * 1024 : amount;
}

function createdAtTime(product: PublicProduct): number {
  if (!product.created_at) return 0;
  const time = Date.parse(product.created_at);
  return Number.isFinite(time) ? time : 0;
}

function comparePrice(
  a: PublicProduct,
  b: PublicProduct,
  direction: "asc" | "desc",
): number {
  const left = parsePriceValue(a.price);
  const right = parsePriceValue(b.price);
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  return direction === "asc" ? left - right : right - left;
}

function compareRecommended(
  a: PublicProduct,
  b: PublicProduct,
  kind: PublicProduct["kind"],
): number {
  if (kind === "used") {
    return createdAtTime(b) - createdAtTime(a) || b.id - a.id;
  }

  const modelDifference = compareModel(a, b);
  if (modelDifference !== 0) return modelDifference;

  const availabilityDifference =
    Number(getProductAvailability(a) === "on_order") -
    Number(getProductAvailability(b) === "on_order");
  if (availabilityDifference !== 0) return availabilityDifference;

  const storageDifference = storageRank(a) - storageRank(b);
  if (storageDifference !== 0) return storageDifference;

  return comparePrice(a, b, "asc");
}

export function sortProducts(
  products: PublicProduct[],
  sort: CatalogSort,
  kind: PublicProduct["kind"],
): PublicProduct[] {
  return [...products].sort((a, b) => {
    let difference = 0;
    if (sort === "price_asc") difference = comparePrice(a, b, "asc");
    else if (sort === "price_desc") difference = comparePrice(a, b, "desc");
    else if (sort === "model") difference = compareModel(a, b);
    else if (sort === "name") {
      difference = naturalCollator.compare(productName(a), productName(b));
    } else {
      difference = compareRecommended(a, b, kind);
    }
    if (difference !== 0) return difference;
    return a.id - b.id;
  });
}

/** Compatibility helpers for callers outside the catalog. */
export function sortUsedProducts(products: PublicProduct[]): PublicProduct[] {
  return sortProducts(products, "recommended", "used");
}

export function sortNewProducts(products: PublicProduct[]): PublicProduct[] {
  return sortProducts(products, "recommended", "new");
}
