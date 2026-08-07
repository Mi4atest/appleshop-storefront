"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { CloseIcon } from "@/components/icons";
import {
  buildOrderMessage,
  formatPriceAmount,
  getCartTotal,
} from "@/lib/cart";
import { getKindLabel } from "@/lib/labels";

const TELEGRAM_ORDER_URL = "https://t.me/AppleShop43";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    setQuantity,
    clearCart,
  } = useCart();
  const titleId = useId();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!isOpen) return null;

  const total = getCartTotal(items);

  const checkout = async () => {
    const message = buildOrderMessage(items);
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      /* ignore */
    }
    window.open(TELEGRAM_ORDER_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        aria-label="Закрыть корзину"
        onClick={closeCart}
      />

      <div className="absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 md:px-5">
          <h2
            id={titleId}
            className="text-sm font-bold uppercase tracking-[0.2em]"
          >
            Корзина
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center"
            aria-label="Закрыть корзину"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em]">
              Пока пусто
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-neutral-500">
              Добавьте товары из каталога
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-8 bg-black px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-80"
            >
              В каталог
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-5">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 border-b border-neutral-100 pb-4"
                >
                  <Link
                    href={`/products/${item.productId}`}
                    onClick={closeCart}
                    className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-neutral-50"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 bg-neutral-100" />
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                      {getKindLabel(item.kind)}
                    </p>
                    <Link
                      href={`/products/${item.productId}`}
                      onClick={closeCart}
                      className="mt-1 block text-sm font-semibold leading-snug tracking-normal transition-opacity hover:opacity-60"
                    >
                      {item.title}
                    </Link>
                    {item.price ? (
                      <p className="mt-1.5 text-sm text-neutral-800">
                        {item.price}
                      </p>
                    ) : null}

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border border-neutral-200">
                        <button
                          type="button"
                          className="h-8 w-8 text-sm transition-opacity hover:opacity-55"
                          aria-label="Уменьшить количество"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-xs tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="h-8 w-8 text-sm transition-opacity hover:opacity-55"
                          aria-label="Увеличить количество"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500 transition-opacity hover:opacity-60"
                        onClick={() => removeItem(item.productId)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-neutral-200 px-4 py-4 md:px-5">
              {total != null ? (
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Итого
                  </span>
                  <span className="text-lg tracking-wide">
                    {formatPriceAmount(total)}
                  </span>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => void checkout()}
                className="w-full bg-black px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-80"
              >
                {copied ? "Заказ скопирован" : "Оформить в Telegram"}
              </button>
              <p className="mt-2 text-center text-[10px] leading-relaxed text-neutral-500">
                Текст заказа копируется в буфер — вставьте его в чат менеджеру
              </p>
              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 transition-opacity hover:opacity-60"
              >
                Очистить корзину
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
