"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { BagIcon, GridIcon, HomeIcon } from "@/components/icons";

const tabClass =
  "flex h-11 w-14 items-center justify-center rounded-full text-neutral-500 transition-colors";

export function MobileTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, isOpen, openCart, badgePulse } = useCart();
  const homeActive = pathname === "/" && !isOpen;
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      reduceMotion.current = media.matches;
      if (media.matches) setHidden(false);
    };
    syncMotion();
    media.addEventListener("change", syncMotion);

    lastY.current = window.scrollY;
    const onScroll = () => {
      if (reduceMotion.current) return;
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < 24) setHidden(false);
      else if (delta > 8) setHidden(true);
      else if (delta < -8) setHidden(false);
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      media.removeEventListener("change", syncMotion);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const concealed = hidden && !isOpen;

  const goHome = () => {
    const dirty =
      window.location.search.length > 0 || window.location.hash.length > 0;
    if (pathname !== "/" || dirty) {
      router.push("/");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goCatalog = () => {
    if (pathname === "/") {
      document.getElementById("catalog")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    router.push("/#catalog");
  };

  return (
    <nav
      className={`fixed inset-x-0 z-50 flex justify-center px-4 motion-safe:transition-transform motion-safe:duration-300 md:hidden ${
        concealed ? "translate-y-[calc(100%+1.25rem)]" : "translate-y-0"
      }`}
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-label="Разделы"
      aria-hidden={concealed}
    >
      <div className="flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/90 px-2 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-md">
        <button
          type="button"
          className={`${tabClass} ${homeActive ? "bg-neutral-200 text-black" : ""}`}
          aria-label="Главная"
          aria-current={homeActive ? "page" : undefined}
          onClick={goHome}
        >
          <HomeIcon />
        </button>
        <button
          type="button"
          className={tabClass}
          aria-label="Каталог"
          onClick={goCatalog}
        >
          <GridIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className={`${tabClass} ${isOpen ? "bg-neutral-200 text-black" : ""}`}
          aria-pressed={isOpen}
          aria-label={count > 0 ? `Корзина, товаров: ${count}` : "Корзина"}
          onClick={openCart}
        >
          <span className="relative inline-flex">
            <BagIcon />
            {count > 0 ? (
              <span
                key={badgePulse}
                className="cart-badge-pulse absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold leading-none text-white"
              >
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </span>
        </button>
      </div>
    </nav>
  );
}
