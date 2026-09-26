import { ProductCard } from "@/components/product-card";
import type { PublicProduct } from "@/lib/api";

type NewItemsGridProps = {
  products: PublicProduct[];
  view?: "grid" | "list";
  error?: string | null;
};

export function NewItemsGrid({
  products,
  view = "grid",
  error,
}: NewItemsGridProps) {
  return (
    <section
      id="new"
      className="scroll-mt-[calc(var(--header-h,4.75rem)+3.25rem)] px-3 pb-14 md:scroll-mt-28 md:px-8 md:pb-20"
    >
      <h2 className="mb-8 py-2 text-center text-sm font-bold uppercase tracking-[0.22em] md:mb-10 md:py-4 md:text-base">
        Новые
      </h2>

      {error ? (
        <p className="text-center text-xs uppercase tracking-[0.18em] text-neutral-500">
          Не удалось загрузить новые товары
        </p>
      ) : products.length === 0 ? (
        <p className="text-center text-xs uppercase tracking-[0.18em] text-neutral-500">
          Пока нет новых товаров
        </p>
      ) : (
        <div
          className={
            view === "grid"
              ? "mx-auto grid max-w-7xl grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12 xl:grid-cols-4 xl:gap-x-10"
              : "mx-auto max-w-5xl max-md:grid max-md:max-w-7xl max-md:grid-cols-2 max-md:gap-x-3 max-md:gap-y-8"
          }
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} view={view} />
          ))}
        </div>
      )}
    </section>
  );
}
