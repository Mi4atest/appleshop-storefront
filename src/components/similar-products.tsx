import { ProductCard } from "@/components/product-card";
import type { PublicProduct } from "@/lib/api";

type SimilarProductsProps = {
  products: PublicProduct[];
};

export function SimilarProducts({ products }: SimilarProductsProps) {
  if (products.length === 0) return null;

  return (
    <section
      className="mt-12 border-t border-neutral-200 px-3 pb-10 pt-8 sm:px-4 md:mt-16 md:px-8 md:pb-14 md:pt-10"
      aria-labelledby="similar-products-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="similar-products-heading"
          className="text-sm font-bold uppercase tracking-[0.18em]"
        >
          Похожие товары
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-10 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={`similar-${product.id}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
