"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ModelQuickFilters } from "@/components/model-quick-filters";
import { ProductCard } from "@/components/product-card";
import { TapButton } from "@/components/tap-button";
import type { PublicProduct } from "@/lib/api";
import type { CatalogCategory } from "@/lib/catalog";
import type { CatalogFacets } from "@/lib/product-attrs";

const USED_RENDER = "/renders/fit/iphone-13-pro.png";
const NEW_RENDER = "/renders/fit/17-pro-blue.png";
const PICKUP_RENDER = "/renders/fit/watch-11-42-black.png";

type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  onSelect: () => void;
};

type MobileHomeIntroProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
  hasUsed: boolean;
  hasNew: boolean;
  facets: CatalogFacets;
  selectedModel: string | null;
  onModelSelect: (modelId: string | null) => void;
  freshProducts: PublicProduct[];
  showFresh: boolean;
};

function scrollToId(id: string) {
  const started = performance.now();
  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (performance.now() - started < 600) {
      window.requestAnimationFrame(tryScroll);
    }
  };
  window.requestAnimationFrame(tryScroll);
}

export function MobileHomeIntro({
  category,
  onCategoryChange,
  hasUsed,
  hasNew,
  facets,
  selectedModel,
  onModelSelect,
  freshProducts,
  showFresh,
}: MobileHomeIntroProps) {
  const slides: Slide[] = [];
  if (hasUsed) {
    slides.push({
      id: "used",
      title: "Б/у в наличии",
      image: USED_RENDER,
      onSelect: () => {
        onCategoryChange("used");
        scrollToId("used");
      },
    });
  }
  if (hasNew) {
    slides.push({
      id: "new",
      title: "Новые",
      image: NEW_RENDER,
      onSelect: () => {
        onCategoryChange("new");
        scrollToId("new");
      },
    });
  }
  slides.push({
    id: "pickup",
    title: "Самовывоз в Кирове",
    subtitle: "Доставка по городу",
    image: PICKUP_RENDER,
    onSelect: () => scrollToId("contact"),
  });

  const tiles = [
    hasUsed
      ? {
          id: "used" as const,
          label: "Б/у",
          image: USED_RENDER,
          target: "used",
        }
      : null,
    hasNew
      ? {
          id: "new" as const,
          label: "Новые",
          image: NEW_RENDER,
          target: "new",
        }
      : null,
  ].filter((tile) => tile !== null);

  return (
    <section className="pb-2 pt-4 md:hidden" aria-label="Подборка">
      <PromoCarousel slides={slides} />

      {tiles.length > 0 ? (
        <div
          className={`mt-4 grid gap-3 px-3 ${tiles.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {tiles.map((tile) => {
            const active = category === tile.id;
            return (
              <TapButton
                key={tile.id}
                onActivate={() => {
                  if (active) {
                    onCategoryChange("all");
                    return;
                  }
                  onCategoryChange(tile.id);
                  scrollToId(tile.target);
                }}
                className={`overflow-hidden rounded-2xl bg-neutral-100 text-left ${
                  active ? "ring-2 ring-black" : ""
                }`}
                aria-pressed={active}
              >
                <span className="relative block aspect-[4/3]">
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-contain p-4"
                  />
                </span>
                <span className="block px-3 pb-3 text-sm font-semibold">
                  {tile.label}
                </span>
              </TapButton>
            );
          })}
        </div>
      ) : null}

      <div className="mt-5">
        <ModelQuickFilters
          layout="tiles"
          models={facets.models}
          selected={selectedModel}
          onSelect={onModelSelect}
        />
      </div>

      {showFresh && freshProducts.length > 0 ? (
        <div className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-3 px-3">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight">
                Свежие поступления
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Недавно добавленные б/у устройства
              </p>
            </div>
            <button
              type="button"
              onClick={() => scrollToId("used")}
              className="shrink-0 text-sm font-semibold"
            >
              Все
            </button>
          </div>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {freshProducts.map((product) => (
              <div
                key={`fresh-mobile-${product.id}`}
                className="w-[46%] shrink-0 snap-start"
              >
                <ProductCard product={product} isFreshArrival view="grid" />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PromoCarousel({ slides }: { slides: Slide[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  const syncIndex = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    if (!slide) return;
    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = slide.offsetWidth + gap;
    if (step <= 0) return;
    setIndex(Math.min(slides.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  };

  const scrollToSlide = (next: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    if (!slide) return;
    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    el.scrollTo({ left: next * (slide.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={syncIndex}
        className="flex snap-x snap-proximity gap-3 overflow-x-auto px-3 [scroll-behavior:auto] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide) => (
          <TapButton
            key={slide.id}
            data-slide
            onActivate={slide.onSelect}
            className="relative h-52 w-[calc(100%-1.5rem)] shrink-0 snap-center overflow-hidden rounded-[20px] bg-neutral-100 text-left"
          >
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="100vw"
              className="object-contain p-6 pb-16"
            />
            <span className="keep-tone absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-10 text-white">
              <span className="block text-lg font-semibold leading-tight">
                {slide.title}
              </span>
              {slide.subtitle ? (
                <span className="mt-1 block text-sm text-white/80">
                  {slide.subtitle}
                </span>
              ) : null}
            </span>
          </TapButton>
        ))}
      </div>
      {slides.length > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Слайд ${slideIndex + 1}: ${slide.title}`}
              onClick={() => scrollToSlide(slideIndex)}
              className={`h-1.5 rounded-full ${
                slideIndex === index ? "w-4 bg-black" : "w-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
