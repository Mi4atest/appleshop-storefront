import type { PublicProduct } from "@/lib/api";

export type ColorOption = {
  id: string;
  label: string;
  emoji: string;
};

export type PriceRangeOption = {
  id: string;
  label: string;
  min: number;
  max: number;
};

const COLOR_RULES: { id: string; label: string; emoji: string; aliases: string[] }[] = [
  {
    id: "black",
    label: "Чёрный",
    emoji: "⚫",
    aliases: [
      "black",
      "midnight",
      "space black",
      "space gray",
      "space grey",
      "graphite",
      "чёрный",
      "черный",
      "графит",
    ],
  },
  {
    id: "white",
    label: "Белый",
    emoji: "⚪",
    aliases: ["white", "starlight", "silver", "белый", "серебрист", "старлайт"],
  },
  {
    id: "natural",
    label: "Natural",
    emoji: "🩶",
    aliases: ["natural titanium", "natural", "натуральн"],
  },
  {
    id: "gold",
    label: "Gold",
    emoji: "🟡",
    aliases: ["gold", "золот"],
  },
  {
    id: "blue",
    label: "Синий",
    emoji: "🔵",
    aliases: [
      "deep blue",
      "ultramarine",
      "sierra blue",
      "blue",
      "синий",
      "тихоокеан",
    ],
  },
  {
    id: "pink",
    label: "Розовый",
    emoji: "🩷",
    aliases: ["soft pink", "pink", "розов"],
  },
  {
    id: "purple",
    label: "Фиолетовый",
    emoji: "🟣",
    aliases: ["deep purple", "purple", "lavender", "фиолет", "лаванд"],
  },
  {
    id: "green",
    label: "Зелёный",
    emoji: "🟢",
    aliases: ["green", "sage", "зелён", "зелен", "шалфей"],
  },
  {
    id: "orange",
    label: "Оранжевый",
    emoji: "🟠",
    aliases: ["cosmic orange", "orange", "оранж", "copper"],
  },
  {
    id: "yellow",
    label: "Жёлтый",
    emoji: "🟨",
    aliases: ["yellow", "жёлт", "желт"],
  },
  {
    id: "teal",
    label: "Бирюзовый",
    emoji: "🩵",
    aliases: ["teal", "бирюз"],
  },
  {
    id: "red",
    label: "Красный",
    emoji: "🔴",
    aliases: ["(product)red", "red", "красн"],
  },
];

export const PRICE_RANGES: PriceRangeOption[] = [
  { id: "0-30000", label: "до 30 000₽", min: 0, max: 30000 },
  { id: "30000-50000", label: "30–50 000₽", min: 30001, max: 50000 },
  { id: "50000-80000", label: "50–80 000₽", min: 50001, max: 80000 },
  { id: "80000+", label: "от 80 000₽", min: 80001, max: Number.POSITIVE_INFINITY },
];

function productText(product: PublicProduct): string {
  return `${product.name} ${product.display_label ?? ""}`.trim();
}

export function parsePriceValue(price: string | null | undefined): number | null {
  if (!price) return null;
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  return Number(digits);
}

export function extractModel(product: PublicProduct): string | null {
  const text = productText(product);
  const lower = text.toLowerCase();

  if (lower.includes("airpods")) {
    const match = text.match(/AirPods(?:\s+(?:Pro|Max|\d+))?(?:\s*(?:USB-C|2|3))?/i);
    return cleanupModel(match?.[0] ?? "AirPods");
  }

  if (lower.includes("watch")) {
    const match = text.match(
      /(?:Apple\s+)?Watch(?:\s+(?:SE|Ultra))?(?:\s*(?:\d+|Series\s*\d+))?(?:\s*\d+mm)?/i,
    );
    return cleanupModel(match?.[0] ?? "Apple Watch");
  }

  if (lower.includes("ipad")) {
    const match = text.match(
      /iPad(?:\s+(?:Pro|Air|mini))?(?:\s*\d+)?(?:\s*\([^)]+\))?/i,
    );
    return cleanupModel(match?.[0] ?? "iPad");
  }

  const iphone = text.match(
    /iPhone\s*(?:Air|\d+\s*(?:Pro\s*Max|Pro|Plus|e)?)/i,
  );
  if (iphone) return cleanupModel(iphone[0]);

  return null;
}

function cleanupModel(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+$/g, "")
    .replace(/\biPhone\s+(\d+)/i, "iPhone $1")
    .trim();
}

export function extractStorage(product: PublicProduct): string | null {
  const text = productText(product);
  const match = text.match(/(\d+)\s*(TB|Gb|GB|Tb)/i);
  if (!match) return null;
  const amount = match[1];
  const normalizedUnit = match[2].toLowerCase() === "tb" ? "TB" : "GB";
  return `${amount}${normalizedUnit}`;
}

export function extractColor(product: PublicProduct): ColorOption | null {
  const text = productText(product).toLowerCase();
  for (const rule of COLOR_RULES) {
    if (rule.aliases.some((alias) => text.includes(alias))) {
      return { id: rule.id, label: rule.label, emoji: rule.emoji };
    }
  }
  return null;
}

export type CatalogFacets = {
  models: string[];
  storages: string[];
  colors: ColorOption[];
  priceRanges: PriceRangeOption[];
};

export function buildCatalogFacets(products: PublicProduct[]): CatalogFacets {
  const models = new Set<string>();
  const storages = new Set<string>();
  const colors = new Map<string, ColorOption>();

  for (const product of products) {
    const model = extractModel(product);
    if (model) models.add(model);
    const storage = extractStorage(product);
    if (storage) storages.add(storage);
    const color = extractColor(product);
    if (color) colors.set(color.id, color);
  }

  const storageRank = (value: string) => {
    const amount = Number(value.replace(/\D/g, ""));
    return value.includes("TB") ? amount * 1024 : amount;
  };

  return {
    models: [...models].sort((a, b) => a.localeCompare(b, "ru")),
    storages: [...storages].sort((a, b) => storageRank(a) - storageRank(b)),
    colors: [...colors.values()].sort((a, b) =>
      a.label.localeCompare(b.label, "ru"),
    ),
    priceRanges: PRICE_RANGES,
  };
}

export type ProductFilterState = {
  model?: string | null;
  storage?: string | null;
  color?: string | null;
  price?: string | null;
};

export function productMatchesFilters(
  product: PublicProduct,
  filters: ProductFilterState,
): boolean {
  if (filters.model) {
    const model = extractModel(product);
    if (model !== filters.model) return false;
  }

  if (filters.storage) {
    const storage = extractStorage(product);
    if (storage !== filters.storage) return false;
  }

  if (filters.color) {
    const color = extractColor(product);
    if (!color || color.id !== filters.color) return false;
  }

  if (filters.price) {
    const range = PRICE_RANGES.find((item) => item.id === filters.price);
    const value = parsePriceValue(product.price);
    if (!range || value == null) return false;
    if (value < range.min) return false;
    if (Number.isFinite(range.max) ? value > range.max : false) return false;
  }

  return true;
}

export function filterProductsByFacets(
  products: PublicProduct[],
  filters: ProductFilterState,
): PublicProduct[] {
  return products.filter((product) => productMatchesFilters(product, filters));
}

export function hasActiveFacets(filters: ProductFilterState): boolean {
  return Boolean(
    filters.model || filters.storage || filters.color || filters.price,
  );
}
