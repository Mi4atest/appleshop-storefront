"use client";

import { useCart } from "@/components/cart-provider";
import { BagIcon } from "@/components/icons";

export function FloatingCartButton() {
  const { count, isOpen, openCart, addedNotice, badgePulse } = useCart();

  if (count < 1 || isOpen) return null;

  const toastVisible = Boolean(addedNotice);

  return (
    <div
      className={`fixed right-3 z-[65] transition-[bottom] duration-300 ease-out md:right-5 ${
        toastVisible ? "bottom-[5.75rem] md:bottom-28" : "bottom-4 md:bottom-6"
      }`}
    >
      <button
        type="button"
        onClick={openCart}
        className="flex items-center gap-2 bg-black py-3 pl-3.5 pr-4 text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-opacity hover:opacity-90"
        aria-label={`Корзина, товаров: ${count}`}
      >
        <span className="relative inline-flex">
          <BagIcon className="h-5 w-5" />
          <span
            key={badgePulse}
            className={`absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-white px-1 text-[9px] font-bold leading-none text-black ${
              badgePulse > 0 ? "cart-badge-pulse" : ""
            }`}
          >
            {count > 99 ? "99+" : count}
          </span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
          Корзина
        </span>
      </button>
    </div>
  );
}
