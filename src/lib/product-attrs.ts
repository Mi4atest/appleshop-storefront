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

export type AvailabilityFilter = "available" | "on_order";

export type FacetOption = {
  id: string;
  label: string;
  count: number;
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

/** Short chip label for mobile quick filters: "iPhone 13 Pro" → "13 Pro". */
export function shortModelChipLabel(full: string): string {
  const value = full.replace(/\s+/g, " ").trim();
  const lower = value.toLowerCase();

  if (lower.includes("airpods")) {
    return value
      .replace(/^AirPods\s*/i, "")
      .replace(/\s+/g, " ")
      .trim() || "AirPods";
  }

  if (lower.includes("watch")) {
    let short = value
      .replace(/^(?:Apple\s+)?Watch\s*/i, "")
      .replace(/^Series\s*/i, "S")
      .replace(/\s+/g, " ")
      .trim();
    // "SE 3 44mm" → "SE3 44", "11 42mm" → "S11 42"
    short = short
      .replace(/\bSE\s*(\d+)/i, "SE$1")
      .replace(/^(\d+)\b/, "S$1")
      .replace(/(\d+)\s*mm\b/i, "$1")
      .trim();
    return short || "Watch";
  }

  if (lower.includes("ipad")) {
    return value
      .replace(/^iPad\s*/i, "")
      .replace(/\s*\([^)]*\)\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "iPad";
  }

  if (/^iPhone\s+/i.test(value)) {
    return value.replace(/^iPhone\s+/i, "").trim() || value;
  }

  return value;
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

export type ProductFilterState = {
  model?: string | null;
  storage?: string | null;
  color?: string | null;
  price?: string | null;
  availability?: AvailabilityFilter | null;
};

export type ProductFilterKey = keyof ProductFilterState;

export type CatalogFacets = {
  models: FacetOption[];
  storages: FacetOption[];
  colors: FacetOption[];
  priceRanges: FacetOption[];
  availability: FacetOption[];
};

const FILTER_KEYS: ProductFilterKey[] = [
  "model",
  "storage",
  "price",
  "color",
  "availability",
];

const naturalCollator = new Intl.Collator("ru", {
  numeric: true,
  sensitivity: "base",
});

function storageRank(value: string): number {
  const amount = Number(value.replace(/\D/g, ""));
  return value.includes("TB") ? amount * 1024 : amount;
}

export function getProductAvailability(
  product: PublicProduct,
): AvailabilityFilter | null {
  if (product.availability_status === "on_order") return "on_order";
  if (product.availability_status === "available") return "available";
  return null;
}

function countOptions(
  products: PublicProduct[],
  getOption: (product: PublicProduct) => { id: string; label: string } | null,
): FacetOption[] {
  const options = new Map<string, FacetOption>();
  for (const product of products) {
    const option = getOption(product);
    if (!option) continue;
    const existing = options.get(option.id);
    if (existing) existing.count += 1;
    else options.set(option.id, { ...option, count: 1 });
  }
  return [...options.values()];
}

function productsForFacet(
  products: PublicProduct[],
  filters: ProductFilterState,
  facet: ProductFilterKey,
): PublicProduct[] {
  return products.filter((product) =>
    productMatchesFilters(product, filters, facet),
  );
}

/** Build each facet after applying every active filter except itself. */
export function buildCatalogFacets(
  products: PublicProduct[],
  filters: ProductFilterState = {},
): CatalogFacets {
  const modelProducts = productsForFacet(products, filters, "model");
  const storageProducts = productsForFacet(products, filters, "storage");
  const colorProducts = productsForFacet(products, filters, "color");
  const priceProducts = productsForFacet(products, filters, "price");
  const availabilityProducts = productsForFacet(
    products,
    filters,
    "availability",
  );

  const models = countOptions(modelProducts, (product) => {
    const model = extractModel(product);
    return model ? { id: model, label: model } : null;
  }).sort((a, b) => naturalCollator.compare(a.label, b.label));
  if (filters.model && !models.some((option) => option.id === filters.model)) {
    models.push({ id: filters.model, label: filters.model, count: 0 });
  }

  const storages = countOptions(storageProducts, (product) => {
    const storage = extractStorage(product);
    return storage ? { id: storage, label: storage } : null;
  }).sort((a, b) => storageRank(a.id) - storageRank(b.id));
  if (
    filters.storage &&
    !storages.some((option) => option.id === filters.storage)
  ) {
    storages.push({
      id: filters.storage,
      label: filters.storage,
      count: 0,
    });
  }

  const colors = countOptions(colorProducts, (product) => {
    const color = extractColor(product);
    return color
      ? { id: color.id, label: `${color.emoji} ${color.label}` }
      : null;
  }).sort((a, b) => naturalCollator.compare(a.label, b.label));
  if (filters.color && !colors.some((option) => option.id === filters.color)) {
    const rule = COLOR_RULES.find((item) => item.id === filters.color);
    colors.push({
      id: filters.color,
      label: rule ? `${rule.emoji} ${rule.label}` : filters.color,
      count: 0,
    });
  }

  const priceRanges = PRICE_RANGES.map((range) => ({
    id: range.id,
    label: range.label,
    count: priceProducts.filter((product) => {
      const price = parsePriceValue(product.price);
      if (price == null || price < range.min) return false;
      return !Number.isFinite(range.max) || price <= range.max;
    }).length,
  })).filter((option) => option.count > 0);
  if (
    filters.price &&
    !priceRanges.some((option) => option.id === filters.price)
  ) {
    const range = PRICE_RANGES.find((item) => item.id === filters.price);
    if (range) {
      priceRanges.push({ id: range.id, label: range.label, count: 0 });
    }
  }

  const availability = [
    {
      id: "available",
      label: "В наличии",
      count: availabilityProducts.filter(
        (product) => getProductAvailability(product) === "available",
      ).length,
    },
    {
      id: "on_order",
      label: "Под заказ",
      count: availabilityProducts.filter(
        (product) => getProductAvailability(product) === "on_order",
      ).length,
    },
  ].filter((option) => option.count > 0);
  if (
    filters.availability &&
    !availability.some((option) => option.id === filters.availability)
  ) {
    availability.push({
      id: filters.availability,
      label:
        filters.availability === "available" ? "В наличии" : "Под заказ",
      count: 0,
    });
  }

  return { models, storages, colors, priceRanges, availability };
}

export function productMatchesFilters(
  product: PublicProduct,
  filters: ProductFilterState,
  ignoredFilter?: ProductFilterKey,
): boolean {
  if (ignoredFilter !== "model" && filters.model) {
    const model = extractModel(product);
    if (model !== filters.model) return false;
  }

  if (ignoredFilter !== "storage" && filters.storage) {
    const storage = extractStorage(product);
    if (storage !== filters.storage) return false;
  }

  if (ignoredFilter !== "color" && filters.color) {
    const color = extractColor(product);
    if (!color || color.id !== filters.color) return false;
  }

  if (ignoredFilter !== "price" && filters.price) {
    const range = PRICE_RANGES.find((item) => item.id === filters.price);
    const value = parsePriceValue(product.price);
    if (!range || value == null) return false;
    if (value < range.min) return false;
    if (Number.isFinite(range.max) ? value > range.max : false) return false;
  }

  if (
    ignoredFilter !== "availability" &&
    filters.availability &&
    getProductAvailability(product) !== filters.availability
  ) {
    return false;
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
    filters.model ||
      filters.storage ||
      filters.color ||
      filters.price ||
      filters.availability,
  );
}

export function emptyProductFilters(): ProductFilterState {
  return {
    model: null,
    storage: null,
    color: null,
    price: null,
    availability: null,
  };
}

/**
 * Keep the changed facet and retain other selections only while at least one
 * product still matches. This prevents hidden, impossible combinations.
 */
export function reconcileProductFilters(
  products: PublicProduct[],
  filters: ProductFilterState,
  changedFilter?: ProductFilterKey,
  allowAvailability = true,
): ProductFilterState {
  const next = emptyProductFilters();
  const orderedKeys = changedFilter
    ? [changedFilter, ...FILTER_KEYS.filter((key) => key !== changedFilter)]
    : FILTER_KEYS;

  for (const key of orderedKeys) {
    if (key === "availability" && !allowAvailability) continue;
    const value = filters[key];
    if (!value) continue;
    const candidate = { ...next, [key]: value };
    if (products.some((product) => productMatchesFilters(product, candidate))) {
      next[key] = value as never;
    }
  }

  return next;
}

export function productFiltersEqual(
  a: ProductFilterState,
  b: ProductFilterState,
): boolean {
  return FILTER_KEYS.every((key) => (a[key] ?? null) === (b[key] ?? null));
}
