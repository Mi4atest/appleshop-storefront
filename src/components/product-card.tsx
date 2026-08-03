"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { ProductCardMedia } from "@/components/product-card-media";
import { ProductLinks } from "@/components/product-links";
import { getProductBadge } from "@/lib/labels";
import { getProductTitle, type PublicProduct } from "@/lib/api";
import { getDisplayMedia } from "@/lib/product-media";
import { getProductLinks } from "@/lib/product-links";

type ProductCardProps = {
  product: PublicProduct;
  isFreshArrival?: boolean;
};

export function ProductCard({
  product,
  isFreshArrival = false,
}: ProductCardProps) {
  const title = getProductTitle(product);
  const links = getProductLinks(product);
  const badge = getProductBadge(product, { isFreshArrival });
  const { images, videos } = getDisplayMedia(product);
  const href = `/products/${product.id}`;
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title,
      price: product.price,
      image: images[0] ?? null,
      kind: product.kind,
    });
  };

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
