"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { ProductKind } from "@/lib/api";

type ProductStickyCartProps = {
  productId: number;
  title: string;
  price: string | null;
  image: string | null;
  kind: ProductKind;
  avitoUrl?: string | null;
  /** Element that owns the primary in-page CTA — sticky shows when it leaves view. */
  anchorId: string;
};

export function ProductStickyCart({
  productId,
  title,
  price,
  image,
  kind,
  avitoUrl = null,
  anchorId,
}: ProductStickyCartProps) {
  const { addItem, openCart, isOpen } = useCart();
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [anchorId]);

  useEffect(() => {
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    };
  }, []);

  if (isOpen || !visible) return null;

  const handleAdd = () => {
    addItem({ productId, title, price, image, kind, avitoUrl });
    setAdded(true);
    if (timer.current != null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setAdded(false);
      timer.current = null;
    }, 2200);
  };

  return (
    <div
      className="fixed inset-x-0 z-40 border-t border-neutral-200 bg-white/95 px-3 py-2.5 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
      style={{
        bottom: "calc(4.25rem + max(0.5rem, env(safe-area-inset-bottom)))",
      }}
      role="region"
      aria-label="Быстрая покупка"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-neutral-600">{title}</p>
          {price ? (
            <p className="mt-0.5 text-base font-bold tracking-tight">{price}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={`shrink-0 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
            added
              ? "border border-black bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          {added ? "Добавлено" : "В корзину"}
        </button>
        <button
          type="button"
          onClick={openCart}
          className="shrink-0 border border-neutral-300 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em]"
          aria-label="Открыть корзину"
        >
          Корзина
        </button>
      </div>
    </div>
  );
}
