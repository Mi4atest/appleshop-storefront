"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { ProductKind } from "@/lib/api";

type AddToCartButtonProps = {
  productId: number;
  title: string;
  price: string | null;
  image: string | null;
  kind: ProductKind;
};

export function AddToCartButton({
  productId,
  title,
  price,
  image,
  kind,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem({ productId, title, price, image, kind });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={handleClick}
        className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
          added
            ? "border border-black bg-white text-black"
            : "bg-black text-white hover:opacity-80"
        }`}
      >
        {added ? "Добавлено" : "В корзину"}
      </button>
      <button
        type="button"
        onClick={openCart}
        className="border border-neutral-300 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
      >
        Открыть корзину
      </button>
    </div>
  );
}
