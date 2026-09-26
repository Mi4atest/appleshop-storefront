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
  | "burgundy"
  | "glacier"
  | "spacegray"
  | "rosegold"
  | "starlight"
  | "midnight";

type ModelKey =
  | "iphone-18-pro-max"
  | "iphone-18-pro"
  | "iphone-17-pro-max"
  | "iphone-17-pro"
  | "iphone-air"
  | "iphone-17e"
  | "iphone-17"
  | "iphone-16e"
  | "iphone-16-pro-max"
  | "iphone-16-pro"
  | "iphone-16-plus"
  | "iphone-16"
  | "iphone-15-pro-max"
  | "iphone-15-pro"
  | "iphone-15-plus"
  | "iphone-15"
  | "iphone-14-pro-max"
  | "iphone-14-pro"
  | "iphone-14"
  | "iphone-13-pro-max"
  | "iphone-13-pro"
  | "iphone-13"
  | "iphone-12"
  | "ipad-air"
  | "ipad-11"
  | "watch-11"
  | "watch-9"
  | "watch-se3"
  | "watch-se2"
  | "airpods-pro-3"
  | "airpods-pro-2"
  | "airpods-4-anc"
  | "airpods-4"
  | "airpods-3";

/** Product shots from mobi43.ru (square cutouts, matched by model + color). */
const MOBI43: Record<string, string> = {
  "iphone-18-pro-max|black": "/renders/fit/iphone-18-pro-max-black.png",
  "iphone-18-pro-max|burgundy": "/renders/fit/iphone-18-pro-max-burgundy.png",
  "iphone-18-pro-max|glacier": "/renders/fit/iphone-18-pro-max-glacier.png",
  "iphone-18-pro-max|silver": "/renders/fit/iphone-18-pro-max-silver.png",
  "iphone-18-pro-max|": "/renders/fit/iphone-18-pro-max-black.png",

  "iphone-18-pro|black": "/renders/fit/iphone-18-pro-black.png",
  "iphone-18-pro|burgundy": "/renders/fit/iphone-18-pro-burgundy.png",
  "iphone-18-pro|glacier": "/renders/fit/iphone-18-pro-glacier.png",
  "iphone-18-pro|silver": "/renders/fit/iphone-18-pro-silver.png",
  "iphone-18-pro|": "/renders/fit/iphone-18-pro-black.png",

  "iphone-17-pro-max|blue": "/renders/fit/17-pro-blue.png",
  "iphone-17-pro-max|orange": "/renders/fit/17-pro-orange.png",
  "iphone-17-pro-max|silver": "/renders/fit/17-pro-silver.png",
  "iphone-17-pro-max|": "/renders/fit/17-pro-blue.png",

  "iphone-17-pro|blue": "/renders/fit/17-pro-blue.png",
  "iphone-17-pro|orange": "/renders/fit/17-pro-orange.png",
  "iphone-17-pro|silver": "/renders/fit/17-pro-silver.png",
  "iphone-17-pro|": "/renders/fit/17-pro-blue.png",

  "iphone-air|black": "/renders/fit/17-air-Black.png",
  "iphone-air|blue": "/renders/fit/17-air-Blue.png",
  "iphone-air|gold": "/renders/fit/17-air-Gold.png",
  "iphone-air|white": "/renders/fit/17-air-White.png",
  "iphone-air|": "/renders/fit/17-air-Black.png",

  "iphone-17e|black": "/renders/fit/17e-Black.png",
  "iphone-17e|white": "/renders/fit/17e-white-fotor-bg-remover-20260717135031.png",
  "iphone-17e|softpink": "/renders/fit/17e-soft-pink.png",
  "iphone-17e|pink": "/renders/fit/17e-soft-pink.png",
  "iphone-17e|": "/renders/fit/17e-Black.png",

  "iphone-17|black": "/renders/fit/17-Black.png",
  "iphone-17|blue": "/renders/fit/17-Blue.png",
  "iphone-17|lavender": "/renders/fit/17-Lavander.png",
  "iphone-17|sage": "/renders/fit/17-Sage.png",
  "iphone-17|white": "/renders/fit/17-White.png",
  "iphone-17|": "/renders/fit/17-Black.png",

  "iphone-16e|black": "/renders/fit/16e-Black-16-.png",
  "iphone-16e|white": "/renders/fit/16e-white-16-1.png",
  "iphone-16e|": "/renders/fit/16e-Black-16-.png",

  "iphone-16|black": "/renders/fit/16lack-16.png",
  "iphone-16|pink": "/renders/fit/iphone-16-pink.png",
  "iphone-16|teal": "/renders/fit/iphone-16-teal.png",
  "iphone-16|ultramarine": "/renders/fit/iphone-16-ultramarine.png",
  "iphone-16|blue": "/renders/fit/iphone-16-ultramarine.png",
  "iphone-16|white": "/renders/fit/16white-16.png",
  "iphone-16|": "/renders/fit/16lack-16.png",

  "iphone-15-plus|black": "/renders/fit/15-black-15.png",
  "iphone-15-plus|green": "/renders/fit/15Green1515.png",
  "iphone-15-plus|pink": "/renders/fit/15Pink15-.png",
  "iphone-15-plus|yellow": "/renders/fit/15yellow1515-1.png",
  "iphone-15-plus|": "/renders/fit/15-black-15.png",

  "iphone-15|black": "/renders/fit/15-black-15.png",
  "iphone-15|blue": "/renders/fit/iphone-15-blue.png",
  "iphone-15|pink": "/renders/fit/iphone-15-pink.png",
  "iphone-15|": "/renders/fit/15-black-15.png",

  "iphone-14|midnight": "/renders/fit/iphone-14-midnight.png",
  "iphone-14|black": "/renders/fit/iphone-14-midnight.png",
  "iphone-14|blue": "/renders/fit/iphone-14-blue.png",
  "iphone-14|yellow": "/renders/fit/iphone-14-yellow.png",
  "iphone-14|starlight": "/renders/fit/iphone-14-starlight.png",
  "iphone-14|white": "/renders/fit/iphone-14-starlight.png",
  "iphone-14|": "/renders/fit/iphone-14-midnight.png",

  "ipad-air|blue": "/renders/fit/ipad-air-blue.png",
  "ipad-air|purple": "/renders/fit/ipad-air-purple.png",
  "ipad-air|spacegray": "/renders/fit/ipad-air-spacegray.png",
  "ipad-air|black": "/renders/fit/ipad-air-spacegray.png",
  "ipad-air|starlight": "/renders/fit/ipad-air-starlight.png",
  "ipad-air|white": "/renders/fit/ipad-air-starlight.png",
  "ipad-air|": "/renders/fit/ipad-air-blue.png",

  "ipad-11|blue": "/renders/fit/ipad-11-blue.png",
  "ipad-11|pink": "/renders/fit/ipad-11-pink.png",
  "ipad-11|silver": "/renders/fit/ipad-11-silver.png",
  "ipad-11|white": "/renders/fit/ipad-11-silver.png",
  "ipad-11|yellow": "/renders/fit/ipad-11-yellow.png",
  "ipad-11|": "/renders/fit/ipad-11-blue.png",

  "watch-11|black": "/renders/fit/watch-11-42-black.png",
  "watch-11|rosegold": "/renders/fit/watch-11-42-rose.png",
  "watch-11|gold": "/renders/fit/watch-11-42-rose.png",
  "watch-11|pink": "/renders/fit/watch-11-42-rose.png",
  "watch-11|silver": "/renders/fit/11-42-silver-1.png",
  "watch-11|white": "/renders/fit/11-42-silver-1.png",
  "watch-11|spacegray": "/renders/fit/watch-11-42-space-Gray.png",
  "watch-11|": "/renders/fit/watch-11-42-black.png",

  "watch-se3|midnight": "/renders/fit/SE3-40-Midnight.png",
  "watch-se3|black": "/renders/fit/SE3-40-Midnight.png",
  "watch-se3|starlight": "/renders/fit/apple-watch-se-3-40mm-starlight-800x800-1.png",
  "watch-se3|white": "/renders/fit/apple-watch-se-3-40mm-starlight-800x800-1.png",
  "watch-se3|": "/renders/fit/SE3-40-Midnight.png",

  "watch-se2|midnight": "/renders/fit/watch-se-40-midnight.png",
  "watch-se2|black": "/renders/fit/watch-se-40-midnight.png",
  "watch-se2|silver": "/renders/fit/watch-se-40-silver.png",
  "watch-se2|starlight": "/renders/fit/watch-se-40-starlight.png",
  "watch-se2|white": "/renders/fit/watch-se-40-starlight.png",
  "watch-se2|": "/renders/fit/watch-se-40-midnight.png",

  "watch-9|midnight": "/renders/fit/watch-s9-45-midnight.png",
  "watch-9|black": "/renders/fit/watch-s9-45-midnight.png",
  "watch-9|starlight": "/renders/fit/watch-s9-45-starlight.png",
  "watch-9|white": "/renders/fit/watch-s9-45-starlight.png",
  "watch-9|": "/renders/fit/watch-s9-45-midnight.png",

  "airpods-pro-3|": "/renders/fit/AirPods-Pro-3.png",
  "airpods-pro-2|": "/renders/fit/airpods-pro-2.png",
  "airpods-4-anc|": "/renders/fit/airpods-4.png",
  "airpods-4|": "/renders/fit/airpods-4.png",
  "airpods-3|": "/renders/fit/airpods-3.png",
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
    ["burgundy", ["burgundy", "бургунди", "бордо"]],
    ["glacier", ["glacier", "глейшер", "глясер"]],
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
  if (name.includes("airpods 3")) return "airpods-3";
  if (name.includes("airpods")) return "airpods-4";

  if (name.includes("iphone 18 pro max")) return "iphone-18-pro-max";
  if (name.includes("iphone 18 pro")) return "iphone-18-pro";
  if (name.includes("iphone 17 pro max")) return "iphone-17-pro-max";
  if (name.includes("iphone 17 pro")) return "iphone-17-pro";
  if (name.includes("iphone 17 air") || name.includes("iphone air")) {
    return "iphone-air";
  }
  if (name.includes("iphone 17e")) return "iphone-17e";
  if (/\biphone 17\b/.test(name)) return "iphone-17";
  if (name.includes("iphone 16e")) return "iphone-16e";
  if (name.includes("iphone 16 pro max")) return "iphone-16-pro-max";
  if (name.includes("iphone 16 pro")) return "iphone-16-pro";
  if (name.includes("iphone 16 plus")) return "iphone-16-plus";
  if (name.includes("iphone 16")) return "iphone-16";
  if (name.includes("iphone 15 pro max")) return "iphone-15-pro-max";
  if (name.includes("iphone 15 pro")) return "iphone-15-pro";
  if (name.includes("iphone 15 plus")) return "iphone-15-plus";
  if (name.includes("iphone 15")) return "iphone-15";
  if (name.includes("iphone 14 pro max")) return "iphone-14-pro-max";
  if (name.includes("iphone 14 pro")) return "iphone-14-pro";
  if (name.includes("iphone 14")) return "iphone-14";
  if (name.includes("iphone 13 pro max")) return "iphone-13-pro-max";
  if (name.includes("iphone 13 pro")) return "iphone-13-pro";
  if (name.includes("iphone 13")) return "iphone-13";
  if (name.includes("iphone 12")) return "iphone-12";

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
  if (
    name.includes("watch") &&
    (name.includes("series 9") ||
      name.includes("watch 9") ||
      /\bseries\s*9\b/.test(name))
  ) {
    return "watch-9";
  }
  if (name.includes("watch")) return "watch-11";

  return null;
}

function lookup(model: ModelKey, color: ColorKey | null): string | null {
  if (color) return MOBI43[`${model}|${color}`] ?? null;
  return MOBI43[`${model}|`] ?? null;
}

export function resolveProductRender(product: PublicProduct): string | null {
  const name = productName(product);
  const model = detectModel(name);
  if (!model) return null;
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
  "iphone-18-pro-max": "/renders/fit/iphone-18-pro-max-glacier.png",
  "iphone-18-pro": "/renders/fit/iphone-18-pro-burgundy.png",
  "iphone-17-pro-max": "/renders/fit/17-pro-blue.png",
  "iphone-17-pro": "/renders/fit/17-pro-orange.png",
  "iphone-air": "/renders/fit/17-air-Black.png",
  "iphone-17e": "/renders/fit/17e-Black.png",
  "iphone-17": "/renders/fit/17-Black.png",
  "iphone-16e": "/renders/fit/16e-Black-16-.png",
  "iphone-16-pro-max": "/renders/fit/iphone-16-pro-black-titanium.png",
  "iphone-16-pro": "/renders/fit/iphone-16-pro-black-titanium.png",
  "iphone-16-plus": "/renders/fit/iphone-16-plus-pink.png",
  "iphone-16": "/renders/fit/16lack-16.png",
  "iphone-15-pro-max": "/renders/fit/iphone-15-pro-blue-titanium.png",
  "iphone-15-pro": "/renders/fit/iphone-15-pro-blue-titanium.png",
  "iphone-15-plus": "/renders/fit/15-black-15.png",
  "iphone-15": "/renders/fit/15-black-15.png",
  "iphone-14-pro-max": "/renders/fit/iphone-14-pro-deep-purple.png",
  "iphone-14-pro": "/renders/fit/iphone-14-pro-deep-purple.png",
  "iphone-14": "/renders/fit/iphone-14-midnight.png",
  "iphone-13-pro-max": "/renders/fit/iphone-13-pro.png",
  "iphone-13-pro": "/renders/fit/iphone-13-pro.png",
  "iphone-13": "/renders/fit/iphone-13-midnight.png",
  "iphone-12": "/renders/fit/iphone-12-black.png",
  "ipad-air": "/renders/fit/ipad-air-blue.png",
  "ipad-11": "/renders/fit/ipad-11-blue.png",
  "watch-11": "/renders/fit/watch-11-42-black.png",
  "watch-9": "/renders/fit/watch-s9-45-midnight.png",
  "watch-se3": "/renders/fit/SE3-40-Midnight.png",
  "watch-se2": "/renders/fit/watch-se-40-midnight.png",
  "airpods-pro-3": "/renders/fit/AirPods-Pro-3.png",
  "airpods-pro-2": "/renders/fit/airpods-pro-2.png",
  "airpods-4-anc": "/renders/fit/airpods-4.png",
  "airpods-4": "/renders/fit/airpods-4.png",
  "airpods-3": "/renders/fit/airpods-3.png",
};

/** Thumbnail for a facet model label (e.g. "iPhone 13 Pro"). */
export function chipThumbForModel(label: string): string {
  const lower = label.toLowerCase();
  const model = detectModel(lower);
  if (model === "watch-se2" && /\b44\s*mm\b/.test(lower)) {
    return "/renders/fit/watch-se-44-silver.png";
  }
  if (model && CHIP_THUMBS[model]) return CHIP_THUMBS[model]!;

  if (lower.includes("watch")) return "/renders/fit/watch-11-42-black.png";
  if (lower.includes("ipad")) return "/renders/fit/ipad10-blue-1.png";
  if (lower.includes("airpods")) return "/renders/fit/AirPods-Pro-3.png";
  if (lower.includes("iphone") || /^\d/.test(lower)) {
    return "/renders/fit/17-Black.png";
  }
  return "/renders/fit/17-Black.png";
}
