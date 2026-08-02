import Link from "next/link";
import { ProductCardMedia } from "@/components/product-card-media";
import { ProductLinks } from "@/components/product-links";
import { getProductBadge } from "@/lib/labels";
import { getProductTitle, type PublicProduct } from "@/lib/api";
import { getDisplayMedia } from "@/lib/product-media";
import { getProductLinks } from "@/lib/product-links";

type ProductCardProps = {
  product: PublicProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const title = getProductTitle(product);
  const links = getProductLinks(product);
  const badge = getProductBadge(product);
  const { images, videos } = getDisplayMedia(product);
  const href = `/products/${product.id}`;

  return (
    <article className="group w-full" data-product-card>
      <Link href={href} className="block outline-offset-4">
        <ProductCardMedia
          title={title}
          badge={badge}
          images={images}
          videoUrl={videos[0] ?? null}
        />
        <div className="mt-3 px-1 text-center">
          <p className="line-clamp-2 text-[11px] font-bold uppercase leading-snug tracking-[0.12em] md:text-xs">
            {title}
          </p>
          {product.price ? (
            <p className="mt-1.5 text-xs font-normal tracking-wide text-neutral-800 md:text-sm">
              {product.price}
            </p>
          ) : null}
        </div>
      </Link>
      <div className="px-1">
        <ProductLinks links={links} />
      </div>
    </article>
  );
}
