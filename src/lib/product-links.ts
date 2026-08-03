import type { PublicProduct, PublicProductLinks } from "@/lib/api";

export type ProductLinkKey =
  | "telegram"
  | "vk"
  | "vk_post"
  | "avito"
  | "max"
  | "instagram";

export type ProductLink = {
  key: ProductLinkKey;
  label: string;
  href: string;
};

/**
 * Display order for storefront cards / PDP.
 * Prefer product.links from API; skip deep-link-only max:// and duplicate max_* keys.
 */
const LINK_ORDER: {
  key: ProductLinkKey;
  label: string;
  linksKeys: (keyof PublicProductLinks)[];
  fallbackFields: string[];
}[] = [
  {
    key: "telegram",
    label: "Telegram",
    linksKeys: ["telegram"],
    fallbackFields: ["telegram_link"],
  },
  {
    key: "vk",
    label: "VK товар",
    linksKeys: ["vk_market"],
    fallbackFields: ["vk_product_link"],
  },
  {
    key: "vk_post",
    label: "VK пост",
    linksKeys: ["vk_post"],
    fallbackFields: ["vk_post_link"],
  },
  {
    key: "max",
    label: "MAX",
    // Best clickable HTTPS URL — never prefer max:// deep link in browser.
    linksKeys: ["max", "max_share_url"],
    fallbackFields: ["max_share_url"],
  },
  {
    key: "instagram",
    label: "Instagram",
    linksKeys: ["instagram"],
    fallbackFields: ["instagram_link"],
  },
  {
    key: "avito",
    label: "Авито",
    linksKeys: ["avito"],
    fallbackFields: ["avito_url"],
  },
];

/** New SKUs currently share channel-level TG / VK wall posts — hide those. */
const NEW_PRODUCT_LINK_KEYS: ProductLinkKey[] = ["vk", "avito"];

const SHOP_CHANNELS: ProductLink[] = [
  {
    key: "instagram",
    label: "Instagram магазина",
    href: "https://instagram.com/appleshop43",
  },
  {
    key: "vk_post",
    label: "ВК магазина",
    href: "https://vk.com/appleshop43",
  },
  {
    key: "telegram",
    label: "Telegram-канал",
    href: "https://t.me/AppleShop43",
  },
];

function asHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Skip app deep links in the public web UI.
  if (/^(max|vk|tg|instagram):\/\//i.test(trimmed)) return null;
  return trimmed;
}

function readFallbackField(
  product: PublicProduct,
  field: string,
): string | null {
  const record = product as PublicProduct & Record<string, unknown>;
  return asHttpUrl(record[field]);
}

export function getProductLinks(product: PublicProduct): ProductLink[] {
  const bag = product.links ?? null;
  const result: ProductLink[] = [];
  const allowed =
    product.kind === "new" ? new Set(NEW_PRODUCT_LINK_KEYS) : null;

  for (const config of LINK_ORDER) {
    if (allowed && !allowed.has(config.key)) continue;

    let href: string | null = null;

    if (bag) {
      for (const linksKey of config.linksKeys) {
        href = asHttpUrl(bag[linksKey]);
        if (href) break;
      }
    }

    if (!href) {
      for (const field of config.fallbackFields) {
        href = readFallbackField(product, field);
        if (href) break;
      }
    }

    if (!href) continue;
    result.push({
      key: config.key,
      label: config.label,
      href,
    });
  }

  return result;
}

/** Shop-level channels when the SKU itself has no matching outbound link. */
export function getShopChannelLinks(
  productLinks: ProductLink[] = [],
): ProductLink[] {
  const present = new Set(productLinks.map((link) => link.key));
  return SHOP_CHANNELS.filter((link) => {
    if (link.key === "telegram" && present.has("telegram")) return false;
    if (link.key === "instagram" && present.has("instagram")) return false;
    if (
      link.key === "vk_post" &&
      (present.has("vk") || present.has("vk_post"))
    ) {
      return false;
    }
    return true;
  });
}

/** Primary click target for card media: Telegram → VK market → Instagram → MAX → Avito → VK post. */
export function getPrimaryProductHref(product: PublicProduct): string | null {
  const preferred: ProductLinkKey[] = [
    "telegram",
    "vk",
    "instagram",
    "max",
    "avito",
    "vk_post",
  ];
  const links = getProductLinks(product);
  for (const key of preferred) {
    const match = links.find((link) => link.key === key);
    if (match) return match.href;
  }
  return links[0]?.href ?? null;
}
