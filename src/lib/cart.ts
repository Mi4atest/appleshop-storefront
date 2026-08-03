import type { ProductKind } from "@/lib/api";

export type CartItem = {
  productId: number;
  title: string;
  price: string | null;
  image: string | null;
  kind: ProductKind;
  quantity: number;
};

export type CartProductInput = Omit<CartItem, "quantity">;

export const CART_STORAGE_KEY = "appleshop-cart-v1";

export function parsePriceAmount(price: string | null | undefined): number | null {
  if (!price) return null;
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  const value = Number(digits);
  return Number.isFinite(value) ? value : null;
}

export function formatPriceAmount(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]): number | null {
  let total = 0;
  let hasPrice = false;

  for (const item of items) {
    const unit = parsePriceAmount(item.price);
    if (unit == null) continue;
    hasPrice = true;
    total += unit * item.quantity;
  }

  return hasPrice ? total : null;
}

export function buildOrderMessage(items: CartItem[]): string {
  const lines = ["Здравствуйте! Хочу оформить заказ:", ""];

  items.forEach((item, index) => {
    const price = item.price ? ` — ${item.price}` : "";
    lines.push(
      `${index + 1}. ${item.title} × ${item.quantity}${price}`,
    );
  });

  const total = getCartTotal(items);
  if (total != null) {
    lines.push("", `Итого: ${formatPriceAmount(total)}`);
  }

  return lines.join("\n");
}

export function normalizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  const items: CartItem[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const productId = Number(record.productId);
    const quantity = Number(record.quantity);
    const title = typeof record.title === "string" ? record.title.trim() : "";
    const kind = record.kind === "used" || record.kind === "new" ? record.kind : null;

    if (!Number.isFinite(productId) || !title || !kind) continue;
    if (!Number.isFinite(quantity) || quantity < 1) continue;

    items.push({
      productId,
      title,
      price: typeof record.price === "string" ? record.price : null,
      image: typeof record.image === "string" ? record.image : null,
      kind,
      quantity: Math.min(99, Math.floor(quantity)),
    });
  }

  return items;
}
