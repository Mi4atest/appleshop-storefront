import Image from "next/image";
import type { ProductLink, ProductLinkKey } from "@/lib/product-links";

type ProductLinksProps = {
  links: ProductLink[];
  size?: "sm" | "md";
};

const ICON_SRC: Record<ProductLinkKey, string> = {
  telegram: "/icons/social/telegram.png",
  vk: "/icons/social/vk-market.png",
  vk_post: "/icons/social/vk-post.png",
  max: "/icons/social/max.png",
  instagram: "/icons/social/instagram.png",
  avito: "/icons/social/avito.png",
};

/** Short visible pill labels — distinguish VK market vs wall post. */
const PILL_LABEL: Record<ProductLinkKey, string> = {
  telegram: "Telegram",
  vk: "VK товар",
  vk_post: "VK пост",
  max: "MAX",
  instagram: "Instagram",
  avito: "Авито",
};

export function ProductLinks({ links, size = "sm" }: ProductLinksProps) {
  if (links.length === 0) return null;

  const md = size === "md";
  const iconPx = md ? 22 : 18;

  return (
    <ul
      className={
        md
          ? "mt-2 flex flex-wrap items-center gap-2"
          : "mt-2 flex flex-wrap items-center gap-1.5"
      }
    >
      {links.map((link) => {
        const src = ICON_SRC[link.key];
        const pillLabel = PILL_LABEL[link.key];
        return (
          <li key={`${link.key}:${link.href}`}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                md
                  ? "inline-flex h-11 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 pl-2.5 pr-3.5 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-100"
                  : "inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 pl-2 pr-2.5 text-xs font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-100"
              }
              aria-label={link.label}
              title={link.label}
            >
              <span className="keep-tone relative inline-flex shrink-0 items-center justify-center">
                <Image
                  src={src}
                  alt=""
                  width={iconPx}
                  height={iconPx}
                  className={
                    md
                      ? "h-[22px] w-[22px] object-contain"
                      : "h-[18px] w-[18px] object-contain"
                  }
                />
              </span>
              <span>{pillLabel}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
