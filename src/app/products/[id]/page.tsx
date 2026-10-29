import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeaderShell } from "@/components/header-shell";
import { ProductCarousel } from "@/components/product-carousel";
import { ProductLinks } from "@/components/product-links";
import { ProductSpecs } from "@/components/product-specs";
import { ProductStickyCart } from "@/components/product-sticky-cart";
import { SimilarProducts } from "@/components/similar-products";
import {
  fetchAllProductsByKind,
  fetchProductById,
  getProductTitle,
} from "@/lib/api";
import {
  getAvailabilityLabel,
  getKindLabel,
  getProductBadge,
} from "@/lib/labels";
import { getDisplayMedia } from "@/lib/product-media";
import { getProductLinks, getShopChannelLinks } from "@/lib/product-links";
import { selectSimilarProducts } from "@/lib/similar-products";
import { fetchTelegramDescription } from "@/lib/telegram-description";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return { title: "Товар" };

  const result = await fetchProductById(numericId);
  if (!result.ok) return { title: "Товар не найден" };

  const title = getProductTitle(result.data);
  return {
    title,
    description: `${title}${result.data.price ? ` — ${result.data.price}` : ""}`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const [result, usedResult, newResult] = await Promise.all([
    fetchProductById(numericId),
    fetchAllProductsByKind("used"),
    fetchAllProductsByKind("new"),
  ]);
  if (!result.ok) notFound();

  const product = result.data;
  const title = getProductTitle(product);
  const links = getProductLinks(product);
  const shopLinks =
    product.kind === "new" ? [] : getShopChannelLinks(links);
  const { images, videos, usingRender } = getDisplayMedia(product);
  const description =
    product.description?.trim() ||
    (product.kind === "used"
      ? await fetchTelegramDescription(product.telegram_link)
      : null);
  const badge = getProductBadge(product);

  const slides = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...videos.map((src) => ({ type: "video" as const, src })),
  ];

  const availability = getAvailabilityLabel(product.availability_status);

  const usedProducts = usedResult.ok ? usedResult.data.items : [];
  const newProducts = newResult.ok ? newResult.data.items : [];
  const searchProducts = [...usedProducts, ...newProducts];
  const similar = selectSimilarProducts(product, searchProducts, 8);

  return (
    <>
      <Suspense fallback={<HeaderShell />}>
        <Header searchProducts={searchProducts} />
      </Suspense>
      <main className="min-w-0 flex-1 overflow-x-hidden bg-white pb-28 md:pb-0">
        <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-4 md:px-8 md:py-10">
          <Link
            href="/#catalog"
            className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600 transition-opacity hover:opacity-60"
          >
            ← В каталог
          </Link>

          <div className="mt-5 grid min-w-0 gap-6 md:mt-6 md:grid-cols-2 md:gap-12">
            <div className="min-w-0">
              <ProductCarousel slides={slides} alt={title} />
            </div>

            <div className="min-w-0">
              <p className="break-words text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                {getKindLabel(product.kind)}
                {product.collection_name
                  ? ` · ${product.collection_name}`
                  : ""}
                {availability ? ` · ${availability}` : ""}
                {badge && badge.label !== availability?.toUpperCase()
                  ? ` · ${badge.label}`
                  : ""}
              </p>

              <h1 className="mt-3 break-words text-xl font-semibold leading-snug tracking-normal sm:text-2xl md:text-3xl md:leading-tight">
                {title}
              </h1>

              {product.price ? (
                <p className="mt-4 text-xl font-bold tracking-tight text-black md:text-2xl">
                  {product.price}
                </p>
              ) : null}

              <div className="mt-6">
                <AddToCartButton
                  productId={product.id}
                  title={title}
                  price={product.price}
                  image={images[0] ?? null}
                  kind={product.kind}
                  avitoUrl={
                    links.find((link) => link.key === "avito")?.href ?? null
                  }
                />
              </div>

              {usingRender ? (
                <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                  Для новых позиций показано типовое изображение модели. Живые
                  фото конкретного экземпляра появятся позже.
                </p>
              ) : null}

              <div className="mt-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]">
                  Смотреть на площадках
                </p>
                <ProductLinks links={links} size="md" />
                {links.length === 0 ? (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    Прямых ссылок на этот товар пока нет — напишите нам в
                    Telegram или откройте каналы магазина ниже.
                  </p>
                ) : null}
              </div>

              {shopLinks.length > 0 ? (
                <div className="mt-5">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Каналы магазина
                  </p>
                  <ProductLinks links={shopLinks} size="md" />
                </div>
              ) : null}

              <div className="mt-8">
                <ProductSpecs product={product} />
              </div>

              <section className="mt-8 border-t border-neutral-200 pt-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
                  Описание
                </h2>
                {description ? (
                  <div className="mt-4 max-w-full space-y-3 text-sm leading-relaxed text-neutral-800">
                    {description
                      .split(/\n+/)
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, index) => (
                        <p key={`${index}-${line.slice(0, 24)}`}>{line}</p>
                      ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                    Подробное текстовое описание пока недоступно в каталоге.
                    Откройте карточку во внешней площадке по ссылкам выше.
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>

        <SimilarProducts products={similar} />
      </main>
      <ProductStickyCart
        productId={product.id}
        title={title}
        price={product.price}
        image={images[0] ?? null}
        kind={product.kind}
        avitoUrl={links.find((link) => link.key === "avito")?.href ?? null}
        anchorId="product-cart-cta"
      />
      <Footer />
    </>
  );
}
