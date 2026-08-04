"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { ProductCardMedia } from "@/components/product-card-media";
import { ProductPlaceholder } from "@/components/product-placeholder";
import { ProductLinks } from "@/components/product-links";
import {
  getProductBadge,
  type ProductBadgeTone,
} from "@/lib/labels";
import { getProductTitle, type PublicProduct } from "@/lib/api";
import { getDisplayMedia } from "@/lib/product-media";
import { getProductLinks } from "@/lib/product-links";

type ProductCardProps = {
  product: PublicProduct;
  isFreshArrival?: boolean;
  view?: "grid" | "list";
};

export function ProductCard({
  product,
  isFreshArrival = false,
  view = "grid",
}: ProductCardProps) {
  const title = getProductTitle(product);
  const links = getProductLinks(product);
  const badge = getProductBadge(product, { isFreshArrival });
  const { images, videos } = getDisplayMedia(product);
  const href = `/products/${product.id}`;
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current != null) window.clearTimeout(addedTimer.current);
    };
  }, []);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title,
      price: product.price,
      image: images[0] ?? null,
      kind: product.kind,
    });
  };

  const handleListAdd = () => {
    handleAddToCart();
    setJustAdded(true);
    if (addedTimer.current != null) window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => {
      setJustAdded(false);
      addedTimer.current = null;
    }, 2200);
  };

  if (view === "list") {
    const badgeToneClass: Record<ProductBadgeTone, string> = {
      available: "bg-black text-white",
      on_order: "border border-black bg-white text-black",
      fresh: "bg-black text-white",
    };
    const image = images[0] ?? null;
    const imageIsRender = image?.startsWith("/renders/") ?? false;

    return (
      <article
        className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-neutral-200 py-3 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5"
        data-product-card
      >
        <Link
          href={href}
          className="relative row-span-2 aspect-square w-full overflow-hidden bg-neutral-50 sm:row-span-1"
          aria-label={title}
        >
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="112px"
              className={imageIsRender ? "object-contain" : "object-cover"}
            />
          ) : (
            <ProductPlaceholder title={title} />
          )}
        </Link>

        <div className="min-w-0 self-center">
          {badge ? (
            <span
              className={`mb-2 inline-flex px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] ${badgeToneClass[badge.tone]}`}
            >
              {badge.label}
            </span>
          ) : null}
          <Link href={href} className="block outline-offset-4">
            <h3 className="break-words text-[11px] font-bold uppercase leading-snug tracking-[0.1em] sm:text-sm">
              {title}
            </h3>
          </Link>
          {product.price ? (
            <p className="mt-1.5 text-sm text-neutral-700 sm:text-base">
              {product.price}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleListAdd}
          className={`col-start-2 self-start px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] transition-colors sm:col-start-3 sm:row-start-1 sm:self-center sm:px-5 sm:py-3 ${
            justAdded
              ? "border border-black bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          {justAdded ? "Добавлено" : "В корзину"}
        </button>
      </article>
    );
  }

  return (
    <article className="group w-full" data-product-card>
      <ProductCardMedia
        title={title}
        badge={badge?.label ?? null}
        badgeTone={badge?.tone}
        images={images}
        videoUrl={videos[0] ?? null}
        href={href}
        onAddToCart={handleAddToCart}
      />
      <Link href={href} className="mt-3 block px-1 text-center outline-offset-4">
        <p className="line-clamp-2 text-[11px] font-bold uppercase leading-snug tracking-[0.12em] md:text-xs">
          {title}
        </p>
        {product.price ? (
          <p className="mt-1.5 text-xs font-normal tracking-wide text-neutral-800 md:text-sm">
            {product.price}
          </p>
        ) : null}
      </Link>
      <div className="px-1">
        <ProductLinks links={links} />
      </div>
    </article>
  );
}
