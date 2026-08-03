"use client";

import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { CloseIcon } from "@/components/icons";

export function CartToast() {
  const { addedNotice, isOpen, openCart, dismissNotice } = useCart();

  if (!addedNotice || isOpen) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center p-3 md:bottom-6 md:p-4"
      role="status"
      aria-live="polite"
    >
      <div
        key={addedNotice.id}
        className="cart-toast-enter pointer-events-auto flex w-full max-w-md items-center gap-3 border border-neutral-200 bg-white px-3 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.14)] md:px-4"
      >
        <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-neutral-50">
          {addedNotice.image ? (
            <Image
              src={addedNotice.image}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 bg-neutral-100" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em]">
            Добавлено в корзину
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-neutral-700">
            {addedNotice.title}
            {addedNotice.quantityInCart > 1
              ? ` · ${addedNotice.quantityInCart} шт.`
              : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={openCart}
          className="shrink-0 bg-black px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-80"
        >
          В корзину
        </button>

        <button
          type="button"
          onClick={dismissNotice}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-neutral-500 transition-opacity hover:opacity-60"
          aria-label="Закрыть уведомление"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
