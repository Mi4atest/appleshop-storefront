import type { PublicProduct } from "@/lib/api";

/** Shared placeholder album used by warehouse for almost all "new" items. */
const SHARED_NEW_IMAGE_MARKER = "AgACAgIAAxkBAAJLV2mEyjygW9ghK3JPkgXr0_xZL9jyAA";

type RenderRule = {
  test: (name: string) => boolean;
  src: string;
};

function includesAll(name: string, parts: string[]): boolean {
  return parts.every((part) => name.includes(part));
}

function detectColor(name: string): string | null {
  const colorMap: [string, string[]][] = [
    ["black", ["black", "чёрный", "черный", "midnight", "space black", "space gray", "space grey", "графит", "graphite"]],
    ["white", ["white", "белый", "starlight", "silver", "серебрист"]],
    ["blue", ["blue", "синий", "ultramarine", "sierra blue", "тихоокеан"]],
    ["pink", ["pink", "розов", "soft pink"]],
    ["teal", ["teal", "бирюз"]],
    ["orange", ["orange", "оранж", "copper"]],
    ["lavender", ["lavender", "лаванд"]],
    ["sage", ["sage", "шалфей"]],
    ["yellow", ["yellow", "жёлт", "желт"]],
    ["green", ["green", "зелён", "зелен"]],
    ["purple", ["purple", "фиолет", "deep purple"]],
    ["red", ["red", "красн", "(product)red"]],
    ["gold", ["gold", "золот"]],
    ["natural", ["natural titanium", "natural", "натуральн"]],
  ];

  for (const [key, aliases] of colorMap) {
    if (aliases.some((alias) => name.includes(alias))) return key;
  }
  return null;
}

const RENDER_RULES: RenderRule[] = [
  {
    test: (n) => includesAll(n, ["iphone 17 pro max"]) && n.includes("orange"),
    src: "/renders/iphone-17-pro-orange.png",
  },
  {
    test: (n) => includesAll(n, ["iphone 17 pro max"]) && (n.includes("silver") || n.includes("white")),
    src: "/renders/iphone-17-pro-max.png",
  },
  {
    test: (n) => includesAll(n, ["iphone 17 pro max"]),
    src: "/renders/iphone-17-pro.png",
  },
  {
    test: (n) => includesAll(n, ["iphone 17 pro"]) && n.includes("orange"),
    src: "/renders/iphone-17-pro-orange.png",
  },
  {
    test: (n) => includesAll(n, ["iphone 17 pro"]) && (n.includes("silver") || n.includes("white")),
    src: "/renders/iphone-17-pro-max.png",
  },
  {
    test: (n) => includesAll(n, ["iphone 17 pro"]),
    src: "/renders/iphone-17-pro.png",
  },
  {
    test: (n) => includesAll(n, ["iphone 17 air"]),
    src: "/renders/iphone-17-air.png",
  },
  {
    test: (n) => n.includes("iphone 17") && n.includes("lavender"),
    src: "/renders/iphone-17-lavender.png",
  },
  {
    test: (n) => n.includes("iphone 17") && n.includes("sage"),
    src: "/renders/iphone-17-sage.png",
  },
  {
    test: (n) => n.includes("iphone 17") && n.includes("blue"),
    src: "/renders/iphone-17-blue.png",
  },
  {
    test: (n) => n.includes("iphone 17") && n.includes("white"),
    src: "/renders/iphone-17-white.png",
  },
  {
    test: (n) => n.includes("iphone 17"),
    src: "/renders/iphone-17-black.png",
  },
  {
    test: (n) => n.includes("iphone 16") && n.includes("pink"),
    src: "/renders/iphone-16-pink.jpg",
  },
  {
    test: (n) => n.includes("iphone 16") && n.includes("teal"),
    src: "/renders/iphone-16-teal.jpg",
  },
  {
    test: (n) => n.includes("iphone 16") && n.includes("ultramarine"),
    src: "/renders/iphone-16-ultramarine.jpg",
  },
  {
    test: (n) => n.includes("iphone 16") && n.includes("white"),
    src: "/renders/iphone-16-white.png",
  },
  {
    test: (n) => n.includes("iphone 16"),
    src: "/renders/iphone-16-black.png",
  },
  {
    test: (n) => n.includes("iphone 15") && n.includes("blue"),
    src: "/renders/iphone-15-blue.jpg",
  },
  {
    test: (n) => n.includes("iphone 15"),
    src: "/renders/iphone-15-black.png",
  },
  {
    test: (n) => n.includes("iphone 14 pro") || n.includes("iphone 13 pro"),
    src: "/renders/iphone-14-pro.png",
  },
  {
    test: (n) => n.includes("iphone"),
    src: "/renders/iphone-category.jpg",
  },
  {
    test: (n) => n.includes("airpods") || n.includes("airpod"),
    src: "/renders/airpods.jpg",
  },
  {
    test: (n) => n.includes("watch") && (n.includes("se") || n.includes("se3") || n.includes("se 3")),
    src: "/renders/watch-se.png",
  },
  {
    test: (n) => n.includes("watch"),
    src: "/renders/watch.png",
  },
  {
    test: (n) => n.includes("ipad"),
    src: "/renders/ipad.png",
  },
];

export function resolveProductRender(product: PublicProduct): string | null {
  const name = `${product.name} ${product.display_label ?? ""}`.toLowerCase();
  for (const rule of RENDER_RULES) {
    if (rule.test(name)) return rule.src;
  }
  return null;
}

function isSharedNewPlaceholder(url: string): boolean {
  return url.includes(SHARED_NEW_IMAGE_MARKER);
}

/**
 * Images for UI: for typical "new" items the warehouse currently reuses one
 * shared album for all SKUs, so we prefer local model/category renders.
 */
export function getDisplayImages(product: PublicProduct): string[] {
  if (product.kind === "new") {
    const render = resolveProductRender(product);
    const realImages = (product.image_urls ?? []).filter(
      (url) => !isSharedNewPlaceholder(url),
    );

    if (render) {
      return realImages.length > 0 ? [render, ...realImages] : [render];
    }

    if (realImages.length > 0) return realImages;
    return product.image_urls ?? [];
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
    // Shared placeholder videos are not useful for "new" catalog cards/PDP.
    videos:
      product.kind === "new" && usingRender
        ? []
        : (product.video_urls ?? []),
    usingRender,
  };
}

export function getProductColorHint(product: PublicProduct): string | null {
  return detectColor(`${product.name} ${product.display_label ?? ""}`.toLowerCase());
}
