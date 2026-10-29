"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { CloseIcon } from "@/components/icons";
import {
  channelHint,
  listCheckoutChannels,
  openCheckoutChannel,
  type CheckoutChannelId,
} from "@/lib/checkout-channels";
import { formatPriceAmount, getCartTotal } from "@/lib/cart";
import { getKindLabel } from "@/lib/labels";

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
  const [copiedChannel, setCopiedChannel] = useState<CheckoutChannelId | null>(
    null,
  );
  const [activeHint, setActiveHint] = useState<string | null>(null);

  const channels = useMemo(() => listCheckoutChannels(items), [items]);

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
    if (!copiedChannel) return;
    const timer = window.setTimeout(() => setCopiedChannel(null), 2200);
    return () => window.clearTimeout(timer);
  }, [copiedChannel]);

  if (!isOpen) return null;

  const total = getCartTotal(items);

  const checkout = async (channelId: CheckoutChannelId) => {
    const result = await openCheckoutChannel(channelId, items);
    if (!result.ok) return;
    setCopiedChannel(channelId);
    setActiveHint(channelHint(channelId));
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
        className="keep-tone absolute inset-0 bg-black/30"
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

              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]">
                Написать менеджеру
              </p>

              <div className="grid grid-cols-2 gap-2">
                {channels.map((channel, index) => {
                  const primary = index === 0;
                  const active = copiedChannel === channel.id;
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => void checkout(channel.id)}
                      className={`px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                        active
                          ? "border border-black bg-white text-black"
                          : primary
                            ? "bg-black text-white hover:opacity-80"
                            : "border border-neutral-300 bg-white text-black hover:border-neutral-400"
                      } ${channels.length % 2 === 1 && index === channels.length - 1 ? "col-span-2" : ""}`}
                    >
                      {active ? "Скопировано" : channel.label}
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-center text-[10px] leading-relaxed text-neutral-500">
                Текст заказа копируется — вставьте его в чат
              </p>
              {activeHint ? (
                <p className="mt-1 text-center text-[10px] leading-relaxed text-neutral-600">
                  {activeHint}
                </p>
              ) : null}

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
