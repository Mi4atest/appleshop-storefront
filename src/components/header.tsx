"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import {
  BagIcon,
  CloseIcon,
  MenuIcon,
  ProfileIcon,
  SearchIcon,
} from "@/components/icons";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const drawerId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const { count, openCart, badgePulse } = useCart();

  const products = useMemo(() => searchProducts, [searchProducts]);

  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    if (pathname !== "/") return;
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const next = params.toString();
    router.replace(next ? `/?${next}` : "/", { scroll: false });
  };

  const openSearch = () => {
    setSearchQuery(urlQuery);
    setSearchOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
        <div className="hidden border-b border-neutral-100 bg-neutral-50 md:block">
          <p className="px-6 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-neutral-500 lg:px-8">
            Доставка и самовывоз в Кирове
          </p>
        </div>
        <div className="flex h-12 items-center gap-2 px-2 md:h-14 md:gap-6 md:px-6 lg:px-8">
          <div className="flex w-10 shrink-0 items-center justify-start md:hidden">
            <button
              type="button"
              className={iconButtonClass}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              aria-controls={drawerId}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-center md:flex-none md:justify-start">
            <BrandMark showWordmark />
          </div>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-8 lg:gap-10 md:flex"
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

          <div className="flex w-[5.25rem] shrink-0 items-center justify-end md:w-auto md:gap-0.5">
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
              className={`${iconButtonClass} hidden md:inline-flex`}
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

        {menuOpen ? (
          <div
            id={drawerId}
            className="fixed inset-0 top-12 z-40 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/25"
              aria-label="Закрыть меню"
              onClick={() => setMenuOpen(false)}
            />
            <div className="relative h-full w-full max-w-sm bg-white px-8 py-10">
              <div className="mb-8">
                <BrandMark size="md" showWordmark />
              </div>
              <nav className="flex flex-col gap-6" aria-label="Мобильное меню">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-bold uppercase tracking-[0.22em]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="text-left text-sm font-bold uppercase tracking-[0.22em]"
                  onClick={() => {
                    setMenuOpen(false);
                    openSearch();
                  }}
                >
                  Поиск
                </button>
              </nav>
            </div>
          </div>
        ) : null}
      </header>

      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        query={searchQuery}
        onQueryChange={updateSearchQuery}
      />
    </>
  );
}
