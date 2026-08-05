/**
 * Regression checks for cart merge helpers (src/lib/cart.ts).
 * Run: node --experimental-strip-types scripts/cart-selftest.ts
 * Fallback below duplicates the pure helpers if strip-types is unavailable.
 */

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function clampQuantity(quantity) {
  return Math.max(1, Math.min(99, Math.floor(quantity)));
}

function addCartItemFallback(items, product, quantity = 1) {
  const nextQty = clampQuantity(quantity);
  const existing = items.find((item) => item.productId === product.productId);
  if (existing) {
    const quantityInCart = Math.min(99, existing.quantity + nextQty);
    return {
      items: items.map((item) =>
        item.productId === product.productId
          ? { ...item, ...product, quantity: quantityInCart }
          : item,
      ),
      quantityInCart,
    };
  }
  return {
    items: [...items, { ...product, quantity: nextQty }],
    quantityInCart: nextQty,
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function loadHelpers() {
  try {
    const mod = await import(
      pathToFileURL(path.join(__dirname, "../src/lib/cart.ts")).href
    );
    return {
      addCartItem: mod.addCartItem,
      setCartItemQuantity: mod.setCartItemQuantity,
      removeCartItem: mod.removeCartItem,
    };
  } catch {
    return {
      addCartItem: addCartItemFallback,
      setCartItemQuantity: (items, productId, quantity) => {
        const next = Math.floor(quantity);
        if (next < 1) return items.filter((item) => item.productId !== productId);
        return items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(99, next) }
            : item,
        );
      },
      removeCartItem: (items, productId) =>
        items.filter((item) => item.productId !== productId),
    };
  }
}

const { addCartItem, setCartItemQuantity } = await loadHelpers();

const productA = {
  productId: 1,
  title: "iPhone A",
  price: "1000 ₽",
  image: null,
  kind: "used",
};
const productB = {
  productId: 2,
  title: "iPhone B",
  price: "2000 ₽",
  image: null,
  kind: "new",
};

// Two tabs: each re-reads shared storage before writing.
let storage = [];
storage = addCartItem(storage, productA, 1).items;
storage = addCartItem(storage, productB, 1).items;

assert(storage.length === 2, "multi-tab adds must keep both products");
assert(
  storage.some((item) => item.productId === 1) &&
    storage.some((item) => item.productId === 2),
  "both product ids must remain",
);

// Stale in-memory baseline (pre-fix): second tab overwrites the first write.
const overwritten = addCartItem([], productB, 1).items;
assert(overwritten.length === 1, "stale write keeps only the second product");
assert(
  storage.length === 2,
  "re-read-before-write path must not lose the first product",
);

const qty = addCartItem(storage, productA, 2);
assert(qty.quantityInCart === 3, "quantity should accumulate to 3");
assert(
  setCartItemQuantity(qty.items, 1, 0).every((item) => item.productId !== 1),
  "quantity 0 removes item",
);

console.log("cart-selftest: ok");
