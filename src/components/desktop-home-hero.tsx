"use client";

import Image from "next/image";
import type { CatalogCategory } from "@/lib/catalog";

const HERO_RENDER = "/renders/fit/17-pro-blue.png";

type DesktopHomeHeroProps = {
  onCategoryChange: (category: CatalogCategory) => void;
  hasUsed: boolean;
  hasNew: boolean;
};

function scrollToCatalog() {
  document.getElementById("catalog")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function DesktopHomeHero({
  onCategoryChange,
  hasUsed,
  hasNew,
}: DesktopHomeHeroProps) {
  const go = (category: CatalogCategory) => {
    onCategoryChange(category);
    window.requestAnimationFrame(scrollToCatalog);
  };

  return (
    <section
      className="relative hidden overflow-hidden border-b border-neutral-200 md:block"
      aria-label="AppleShop"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#e8eef5_0%,#f7f7f7_45%,#ffffff_100%)]" />
      <div
        className="pointer-events-none absolute -right-24 top-1/2 h-[140%] w-[58%] -translate-y-1/2 opacity-90"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55)_0%,transparent_65%)]" />
        <Image
          src={HERO_RENDER}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 55vw, 0px"
          className="object-contain object-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.12)]"
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-12 items-center gap-8 px-6 py-16 lg:px-8 lg:py-20">
        <div className="col-span-12 max-w-xl lg:col-span-6">
          <p className="text-4xl font-bold tracking-[-0.03em] text-black sm:text-5xl lg:text-6xl">
            AppleShop
          </p>
          <h1 className="mt-4 max-w-md text-xl font-medium leading-snug tracking-tight text-neutral-800 sm:text-2xl">
            Техника Apple в Кирове
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500 sm:text-base">
            Новые устройства и проверенные б/у. Самовывоз и доставка по городу.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {hasUsed ? (
              <button
                type="button"
                onClick={() => go("used")}
                className="bg-black px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-80"
              >
                Смотреть б/у
              </button>
            ) : null}
            {hasNew ? (
              <button
                type="button"
                onClick={() => go("new")}
                className="border border-black bg-white px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-neutral-50"
              >
                Новые
              </button>
            ) : null}
            {!hasUsed && !hasNew ? (
              <button
                type="button"
                onClick={scrollToCatalog}
                className="bg-black px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-80"
              >
                В каталог
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
