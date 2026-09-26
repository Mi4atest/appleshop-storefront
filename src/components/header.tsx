"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { BagIcon, ProfileIcon, SearchIcon } from "@/components/icons";
import { useCart } from "@/components/cart-provider";
import { SearchPanel } from "@/components/search-panel";
import type { PublicProduct } from "@/lib/api";

const NAV_LINKS = [
  { href: "/#catalog", label: "Каталог" },
  { href: "/#about", label: "О нас" },
  { href: "/#contact", label: "Контакты" },
];

const iconButtonClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center text-black transition-opacity hover:opacity-60";

type HeaderProps = {
  searchProducts?: PublicProduct[];
};

export function Header({ searchProducts = [] }: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const { count, openCart, badgePulse } = useCart();

  const products = useMemo(() => searchProducts, [searchProducts]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const apply = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${el.offsetHeight}px`,
      );
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  const openSearch = () => {
    setSearchOpen(true);
  };

  const submitSearch = (query: string) => {
    const trimmed = query.trim();
    setSearchOpen(false);

    const params =
      pathname === "/"
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");

    const queryString = params.toString();
    const href = queryString ? `/?${queryString}#catalog` : "/#catalog";
    router.push(href);

    window.setTimeout(() => {
      document.getElementById("catalog")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-neutral-200 bg-white"
      >
        <div className="border-b border-neutral-100 bg-neutral-50">
          <p className="px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-neutral-500 md:px-6 lg:px-8">
            Доставка и самовывоз в Кирове
          </p>
        </div>

        <div className="flex h-12 items-center gap-2 px-3 md:hidden">
          <div className="min-w-0 flex-1">
            <BrandMark showWordmark />
          </div>
          <button
            type="button"
            className={iconButtonClass}
            aria-label="Поиск"
            onClick={openSearch}
          >
            <SearchIcon />
          </button>
        </div>

        <div className="hidden h-14 items-center gap-6 px-6 md:flex lg:px-8">
          <div className="flex min-w-0 shrink-0 items-center justify-start">
            <BrandMark showWordmark />
          </div>

          <nav
            className="min-w-0 flex-1 items-center justify-center gap-8 lg:gap-10 md:flex"
            aria-label="Основная навигация"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-55"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-0.5">
            <button
              type="button"
              className={iconButtonClass}
              aria-label="Поиск"
              onClick={openSearch}
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              className={iconButtonClass}
              aria-label="Профиль"
            >
              <ProfileIcon />
            </button>
            <button
              type="button"
              className={`relative ${iconButtonClass}`}
              aria-label={count > 0 ? `Корзина, товаров: ${count}` : "Корзина"}
              onClick={openCart}
            >
              <BagIcon />
              {count > 0 ? (
                <span
                  key={badgePulse}
                  className="cart-badge-pulse absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center bg-black px-1 text-[9px] font-bold leading-none text-white"
                >
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {searchOpen ? (
        <SearchPanel
          open
          onClose={() => setSearchOpen(false)}
          products={products}
          query={urlQuery}
          onSubmit={submitSearch}
        />
      ) : null}
    </>
  );
}
