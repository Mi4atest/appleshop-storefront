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

export function ProductLinks({ links, size = "sm" }: ProductLinksProps) {
  if (links.length === 0) return null;

  const px = size === "md" ? 36 : 28;
  const buttonClass =
    size === "md"
      ? "inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform hover:scale-105"
      : "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-transform hover:scale-105";

  return (
    <ul className="mt-2 flex flex-wrap items-center justify-center gap-2">
      {links.map((link) => {
        const src = ICON_SRC[link.key];
        return (
          <li key={`${link.key}:${link.href}`}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
              aria-label={link.label}
              title={link.label}
            >
              <Image
                src={src}
                alt={link.label}
                width={px}
                height={px}
                className="h-full w-full object-contain"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
