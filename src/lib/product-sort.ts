import type { PublicProduct } from "@/lib/api";
import {
  extractColor,
  extractStorage,
  parsePriceValue,
} from "@/lib/product-attrs";

function productName(product: PublicProduct): string {
  return `${product.name} ${product.display_label ?? ""}`.toLowerCase();
}

/**
 * Catalog line order for factory-new SKUs (flagship / newer first).
 * Lower rank = higher in the grid.
 */
export function modelLineRank(product: PublicProduct): number {
  const name = productName(product);

  if (name.includes("iphone 17 pro max")) return 10;
  if (name.includes("iphone 17 pro")) return 20;
  if (name.includes("iphone 17 air") || name.includes("iphone air")) return 30;
  if (name.includes("iphone 17e")) return 40;
  if (/\biphone 17\b/.test(name)) return 50;

  if (name.includes("iphone 16e")) return 60;
  if (name.includes("iphone 16 pro max")) return 70;
  if (name.includes("iphone 16 pro")) return 80;
  if (name.includes("iphone 16 plus")) return 90;
  if (name.includes("iphone 16")) return 100;

  if (name.includes("iphone 15 plus")) return 110;
  if (name.includes("iphone 15 pro max")) return 120;
  if (name.includes("iphone 15 pro")) return 130;
  if (name.includes("iphone 15")) return 140;

  if (name.includes("iphone 14 pro max")) return 150;
  if (name.includes("iphone 14 pro")) return 160;
  if (name.includes("iphone 14 plus")) return 170;
  if (name.includes("iphone 14")) return 180;

  if (name.includes("iphone 13 pro max")) return 190;
  if (name.includes("iphone 13 pro")) return 200;
  if (name.includes("iphone 13")) return 210;
  if (name.includes("iphone 12")) return 220;
  if (name.includes("iphone 11")) return 230;
  if (name.includes("iphone")) return 240;

  if (name.includes("ipad pro")) return 300;
  if (name.includes("ipad air")) return 310;
  if (name.includes("ipad mini")) return 320;
  if (name.includes("ipad")) return 330;

  if (name.includes("watch") && name.includes("ultra")) return 400;
  if (
    name.includes("watch") &&
    (name.includes("series 11") ||
      name.includes("watch 11") ||
      /\bwatch\s*11\b/.test(name))
  ) {
    return 410;
  }
  if (
    name.includes("watch") &&
    (name.includes("se3") ||
      name.includes("se 3") ||
      name.includes("se-3") ||
      /\bse[\s-]?3\b/.test(name))
  ) {
    return 420;
  }
  if (
    name.includes("watch") &&
    (name.includes("se2") ||
      name.includes("se 2") ||
      name.includes("se-2") ||
      /\bse[\s-]?2\b/.test(name) ||
      (/\bse\b/.test(name) && !name.includes("series")))
  ) {
    return 430;
  }
  if (name.includes("watch")) return 440;

  if (name.includes("airpods pro 3") || name.includes("airpods-pro-3")) {
    return 500;
  }
  if (name.includes("airpods pro 2") || name.includes("airpods pro")) {
    return 510;
  }
  if (
    name.includes("airpods 4") &&
    (name.includes("anc") || name.includes("шумопод"))
  ) {
    return 520;
  }
  if (name.includes("airpods 4")) return 530;
  if (name.includes("airpods 3")) return 540;
  if (name.includes("airpods")) return 550;

  return 900;
}

/** In stock first; «под заказ» after. Missing status treated as in stock. */
function availabilityRank(product: PublicProduct): number {
  return product.availability_status === "on_order" ? 1 : 0;
}

function storageRank(product: PublicProduct): number {
  const storage = extractStorage(product);
  if (!storage) return Number.POSITIVE_INFINITY;
  const amount = Number(storage.replace(/\D/g, ""));
  if (!Number.isFinite(amount)) return Number.POSITIVE_INFINITY;
  return storage.includes("TB") ? amount * 1024 : amount;
}

function priceRank(product: PublicProduct): number {
  return parsePriceValue(product.price) ?? Number.POSITIVE_INFINITY;
}

function colorLabel(product: PublicProduct): string {
  return extractColor(product)?.label ?? "";
}

function createdAtTime(product: PublicProduct): number {
  if (!product.created_at) return 0;
  const time = Date.parse(product.created_at);
  return Number.isFinite(time) ? time : 0;
}

/** Used catalog: newest intake first. */
export function sortUsedProducts(products: PublicProduct[]): PublicProduct[] {
  return [...products].sort((a, b) => {
    const timeDiff = createdAtTime(b) - createdAtTime(a);
    if (timeDiff !== 0) return timeDiff;
    return b.id - a.id;
  });
}

/**
 * New catalog: model line → in stock before on-order → storage → price → color.
 */
export function sortNewProducts(products: PublicProduct[]): PublicProduct[] {
  return [...products].sort((a, b) => {
    const modelDiff = modelLineRank(a) - modelLineRank(b);
    if (modelDiff !== 0) return modelDiff;

    const availabilityDiff = availabilityRank(a) - availabilityRank(b);
    if (availabilityDiff !== 0) return availabilityDiff;

    const storageDiff = storageRank(a) - storageRank(b);
    if (storageDiff !== 0) return storageDiff;

    const priceDiff = priceRank(a) - priceRank(b);
    if (priceDiff !== 0) return priceDiff;

    const colorDiff = colorLabel(a).localeCompare(colorLabel(b), "ru");
    if (colorDiff !== 0) return colorDiff;

    const nameDiff = productName(a).localeCompare(productName(b), "ru");
    if (nameDiff !== 0) return nameDiff;

    return a.id - b.id;
  });
}
