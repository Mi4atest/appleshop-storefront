import type { PublicProduct } from "@/lib/api";

type ColorKey =
  | "black"
  | "white"
  | "blue"
  | "pink"
  | "softpink"
  | "teal"
  | "orange"
  | "lavender"
  | "sage"
  | "yellow"
  | "green"
  | "purple"
  | "gold"
  | "silver"
  | "ultramarine"
  | "spacegray"
  | "rosegold"
  | "starlight"
  | "midnight";

type ModelKey =
  | "iphone-17-pro-max"
  | "iphone-17-pro"
  | "iphone-air"
  | "iphone-17e"
  | "iphone-17"
  | "iphone-16e"
  | "iphone-16"
  | "iphone-15-plus"
  | "iphone-15"
  | "iphone-14"
  | "iphone-13-pro"
  | "ipad-air"
  | "ipad-11"
  | "watch-11"
  | "watch-se3"
  | "watch-se2"
  | "airpods-pro-3"
  | "airpods-pro-2"
  | "airpods-4-anc"
  | "airpods-4"
  | "airpods-3";

/** Product shots from mobi43.ru (square cutouts, matched by model + color). */
const MOBI43: Record<string, string> = {
  "iphone-17-pro-max|blue": "/renders/mobi43/17-pro-blue.png",
  "iphone-17-pro-max|orange": "/renders/mobi43/17-pro-orange.png",
  "iphone-17-pro-max|silver": "/renders/mobi43/17-pro-silver.png",
  "iphone-17-pro-max|": "/renders/mobi43/17-pro-blue.png",

  "iphone-17-pro|blue": "/renders/mobi43/17-pro-blue.png",
  "iphone-17-pro|orange": "/renders/mobi43/17-pro-orange.png",
  "iphone-17-pro|silver": "/renders/mobi43/17-pro-silver.png",
  "iphone-17-pro|": "/renders/mobi43/17-pro-blue.png",

  "iphone-air|black": "/renders/mobi43/17-air-Black.png",
  "iphone-air|blue": "/renders/mobi43/17-air-Blue.png",
  "iphone-air|gold": "/renders/mobi43/17-air-Gold.png",
  "iphone-air|white": "/renders/mobi43/17-air-White.png",
  "iphone-air|": "/renders/mobi43/17-air-Black.png",

  "iphone-17e|black": "/renders/mobi43/17e-Black.png",
  "iphone-17e|white": "/renders/mobi43/17e-white-fotor-bg-remover-20260717135031.png",
  "iphone-17e|softpink": "/renders/mobi43/17e-soft-pink.png",
  "iphone-17e|pink": "/renders/mobi43/17e-soft-pink.png",
  "iphone-17e|": "/renders/mobi43/17e-Black.png",

  "iphone-17|black": "/renders/mobi43/17-Black.png",
  "iphone-17|blue": "/renders/mobi43/17-Blue.png",
  "iphone-17|lavender": "/renders/mobi43/17-Lavander.png",
  "iphone-17|sage": "/renders/mobi43/17-Sage.png",
  "iphone-17|white": "/renders/mobi43/17-White.png",
  "iphone-17|": "/renders/mobi43/17-Black.png",

  "iphone-16e|black": "/renders/mobi43/16e-Black-16-.png",
  "iphone-16e|white": "/renders/mobi43/16e-white-16-1.png",
  "iphone-16e|": "/renders/mobi43/16e-Black-16-.png",

  "iphone-16|black": "/renders/mobi43/16lack-16.png",
  "iphone-16|pink": "/renders/mobi43/16pink16.jpg",
  "iphone-16|teal": "/renders/mobi43/16teal16.jpg",
  "iphone-16|ultramarine": "/renders/mobi43/16ultramarin16.jpg",
  "iphone-16|blue": "/renders/mobi43/16ultramarin16.jpg",
  "iphone-16|white": "/renders/mobi43/16white-16.png",
  "iphone-16|": "/renders/mobi43/16lack-16.png",

  "iphone-15-plus|black": "/renders/mobi43/15-black-15.png",
  "iphone-15-plus|green": "/renders/mobi43/15Green1515.jpg",
  "iphone-15-plus|pink": "/renders/mobi43/15Pink15-.png",
  "iphone-15-plus|yellow": "/renders/mobi43/15yellow1515-1.png",
  "iphone-15-plus|": "/renders/mobi43/15-black-15.png",

  "iphone-15|black": "/renders/mobi43/15-black-15.png",
  "iphone-15|blue": "/renders/mobi43/15-Blue15.jpg",
  "iphone-15|": "/renders/mobi43/15-black-15.png",

  "iphone-14|midnight": "/renders/mobi43/14-Midnight14.jpg",
  "iphone-14|black": "/renders/mobi43/14-Midnight14.jpg",
  "iphone-14|starlight": "/renders/mobi43/14Starlight14.jpg",
  "iphone-14|white": "/renders/mobi43/14Starlight14.jpg",
  "iphone-14|": "/renders/mobi43/14-Midnight14.jpg",

  "ipad-air|blue": "/renders/mobi43/air11-2024-blue-1.png",
  "ipad-air|purple": "/renders/mobi43/air11-2024-purple.png",
  "ipad-air|spacegray": "/renders/mobi43/air11-2024-space-gray-1.png",
  "ipad-air|black": "/renders/mobi43/air11-2024-space-gray-1.png",
  "ipad-air|starlight": "/renders/mobi43/air11-2024-starlight.png",
  "ipad-air|white": "/renders/mobi43/air11-2024-starlight.png",
  "ipad-air|": "/renders/mobi43/air11-2024-blue-1.png",

  "ipad-11|blue": "/renders/mobi43/ipad10-blue-1.png",
  "ipad-11|pink": "/renders/mobi43/ipad10-pink-1.png",
  "ipad-11|silver": "/renders/mobi43/ipad10-silver.png",
  "ipad-11|white": "/renders/mobi43/ipad10-silver.png",
  "ipad-11|yellow": "/renders/mobi43/ipad10-blue-1.png",
  "ipad-11|": "/renders/mobi43/ipad10-blue-1.png",

  "watch-11|black": "/renders/mobi43/watch-11-42-black.jpg",
  "watch-11|rosegold": "/renders/mobi43/watch-11-42-rose.png",
  "watch-11|gold": "/renders/mobi43/watch-11-42-rose.png",
  "watch-11|pink": "/renders/mobi43/watch-11-42-rose.png",
  "watch-11|silver": "/renders/mobi43/11-42-silver-1.png",
  "watch-11|white": "/renders/mobi43/11-42-silver-1.png",
  "watch-11|spacegray": "/renders/mobi43/watch-11-42-space-Gray.jpg",
  "watch-11|": "/renders/mobi43/watch-11-42-black.jpg",

  "watch-se3|midnight": "/renders/mobi43/SE3-40-Midnight.jpeg",
  "watch-se3|black": "/renders/mobi43/SE3-40-Midnight.jpeg",
  "watch-se3|starlight": "/renders/mobi43/apple-watch-se-3-40mm-starlight-800x800-1.png",
  "watch-se3|white": "/renders/mobi43/apple-watch-se-3-40mm-starlight-800x800-1.png",
  "watch-se3|": "/renders/mobi43/SE3-40-Midnight.jpeg",

  "watch-se2|midnight": "/renders/mobi43/SE2-40mm-Midnight.jpg",
  "watch-se2|black": "/renders/mobi43/SE2-40mm-Midnight.jpg",
  "watch-se2|": "/renders/mobi43/SE2-40mm-Midnight.jpg",

  "airpods-pro-3|": "/renders/mobi43/AirPods-Pro-3.png",
  "airpods-pro-2|": "/renders/mobi43/ap-pro.jpg",
  "airpods-4-anc|": "/renders/mobi43/4.webp",
  "airpods-4|": "/renders/mobi43/4.webp",
};

function productName(product: PublicProduct): string {
  return `${product.name} ${product.display_label ?? ""}`.toLowerCase();
}

export function detectColor(name: string): ColorKey | null {
  const checks: [ColorKey, string[]][] = [
    ["softpink", ["soft pink"]],
    ["rosegold", ["rose gold", "розов золот"]],
    ["spacegray", ["space gray", "space grey", "spacegray", "графит", "graphite"]],
    ["ultramarine", ["ultramarine", "ultramarin"]],
    ["starlight", ["starlight", "старлайт"]],
    ["midnight", ["midnight"]],
    ["lavender", ["lavender", "лаванд", "lavander"]],
    ["sage", ["sage", "шалфей"]],
    ["orange", ["orange", "оранж", "copper"]],
    ["teal", ["teal", "бирюз"]],
    ["yellow", ["yellow", "жёлт", "желт"]],
    ["green", ["green", "зелён", "зелен"]],
    ["purple", ["purple", "фиолет"]],
    ["pink", ["pink", "розов"]],
    ["gold", ["gold", "золот"]],
    ["silver", ["silver", "серебрист"]],
    ["blue", ["blue", "синий", "sierra blue", "mist blue", "тихоокеан"]],
    ["white", ["white", "белый"]],
    ["black", ["black", "чёрный", "черный", "jet black", "space black"]],
  ];

  for (const [key, aliases] of checks) {
    if (aliases.some((alias) => name.includes(alias))) return key;
  }
  return null;
}

function detectModel(name: string): ModelKey | null {
  if (name.includes("airpods pro 3") || name.includes("airpods-pro-3")) {
    return "airpods-pro-3";
  }
  if (name.includes("airpods pro 2") || name.includes("airpods pro")) {
    return "airpods-pro-2";
  }
  if (name.includes("airpods 4") && (name.includes("anc") || name.includes("шумопод"))) {
    return "airpods-4-anc";
  }
  if (name.includes("airpods 4")) return "airpods-4";
  if (name.includes("airpods 3") || name.includes("airpods")) return "airpods-4";

  if (name.includes("iphone 17 pro max")) return "iphone-17-pro-max";
  if (name.includes("iphone 17 pro")) return "iphone-17-pro";
  if (name.includes("iphone 17 air") || name.includes("iphone air")) {
    return "iphone-air";
  }
  if (name.includes("iphone 17e")) return "iphone-17e";
  if (/\biphone 17\b/.test(name)) return "iphone-17";
  if (name.includes("iphone 16e")) return "iphone-16e";
  if (name.includes("iphone 16")) return "iphone-16";
  if (name.includes("iphone 15 plus")) return "iphone-15-plus";
  if (name.includes("iphone 15")) return "iphone-15";
  if (name.includes("iphone 14")) return "iphone-14";
  if (name.includes("iphone 13 pro")) return "iphone-13-pro";

  if (name.includes("ipad air")) return "ipad-air";
  if (name.includes("ipad")) return "ipad-11";

  if (
    name.includes("watch") &&
    (name.includes("series 11") ||
      name.includes("watch 11") ||
      /\bwatch\s*11\b/.test(name))
  ) {
    return "watch-11";
  }
  if (
    name.includes("watch") &&
    (name.includes("se3") ||
      name.includes("se 3") ||
      name.includes("se-3") ||
      /\bse[\s-]?3\b/.test(name))
  ) {
    return "watch-se3";
  }
  if (
    name.includes("watch") &&
    (name.includes("se2") ||
      name.includes("se 2") ||
      name.includes("se-2") ||
      /\bse[\s-]?2\b/.test(name) ||
      (/\bse\b/.test(name) && !name.includes("series")))
  ) {
    return "watch-se2";
  }
  if (name.includes("watch")) return "watch-11";

  return null;
}

function lookup(model: ModelKey, color: ColorKey | null): string | null {
  if (color) {
    const exact = MOBI43[`${model}|${color}`];
    if (exact) return exact;
  }
  return MOBI43[`${model}|`] ?? null;
}

export function resolveProductRender(product: PublicProduct): string | null {
  const name = productName(product);
  const model = detectModel(name);
  if (!model) {
    if (name.includes("iphone")) return "/renders/mobi43/17-Black.png";
    return null;
  }
  return lookup(model, detectColor(name));
}

export function getDisplayImages(product: PublicProduct): string[] {
  if (product.kind === "new") {
    // Warehouse attaches one shared Telegram album (often a used 12 Pro) to
    // almost every new SKU. Never show those URLs — only local storefront renders.
    const render = resolveProductRender(product);
    if (render) return [render];
    return [];
  }

  return product.image_urls ?? [];
}

export function getDisplayMedia(product: PublicProduct): {
  images: string[];
  videos: string[];
  usingRender: boolean;
} {
  const images = getDisplayImages(product);
  const usingRender = images[0]?.startsWith("/renders/") ?? false;

  return {
    images,
    // Same shared album often includes video of the used unit.
    videos: product.kind === "new" ? [] : (product.video_urls ?? []),
    usingRender,
  };
}

export function getProductColorHint(product: PublicProduct): string | null {
  return detectColor(productName(product));
}

/** Eye-catching default thumbs for mobile model quick-filter chips. */
const CHIP_THUMBS: Partial<Record<ModelKey, string>> = {
  "iphone-17-pro-max": "/renders/iphone-17-pro-orange.jpg",
  "iphone-17-pro": "/renders/iphone-17-pro-orange.jpg",
  "iphone-air": "/renders/iphone-air-black.jpg",
  "iphone-17e": "/renders/iphone-17e-black.jpg",
  "iphone-17": "/renders/iphone-17-black.jpg",
  "iphone-16e": "/renders/iphone-16e-black.jpg",
  "iphone-16": "/renders/iphone-16-black.png",
  "iphone-15-plus": "/renders/iphone-15-black.png",
  "iphone-15": "/renders/iphone-15-black.png",
  "iphone-14": "/renders/iphone-14-pro.png",
  "iphone-13-pro": "/renders/iphone-13-pro.jpg",
  "ipad-air": "/renders/ipad-air-blue.jpg",
  "ipad-11": "/renders/ipad-11-blue.jpg",
  "watch-11": "/renders/watch-s11-black.jpg",
  "watch-se3": "/renders/watch-se3-midnight.jpg",
  "watch-se2": "/renders/watch-se.png",
  "airpods-pro-3": "/renders/airpods.jpg",
  "airpods-pro-2": "/renders/airpods.jpg",
  "airpods-4-anc": "/renders/airpods.jpg",
  "airpods-4": "/renders/airpods.jpg",
  "airpods-3": "/renders/airpods.jpg",
};

/** Thumbnail for a facet model label (e.g. "iPhone 13 Pro"). */
export function chipThumbForModel(label: string): string {
  const lower = label.toLowerCase();
  const model = detectModel(lower);
  if (model && CHIP_THUMBS[model]) return CHIP_THUMBS[model]!;

  if (lower.includes("watch")) return "/renders/watch-category.jpg";
  if (lower.includes("ipad")) return "/renders/ipad-11.jpg";
  if (lower.includes("airpods")) return "/renders/airpods.jpg";
  if (lower.includes("iphone") || /^\d/.test(lower)) {
    return "/renders/iphone-category.jpg";
  }
  return "/renders/iphone-category.jpg";
}
