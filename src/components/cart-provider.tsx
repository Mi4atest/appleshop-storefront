"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  getCartCount,
  normalizeCartItems,
  type CartItem,
  type CartProductInput,
} from "@/lib/cart";

export type CartAddedNotice = {
  id: number;
  productId: number;
  title: string;
  image: string | null;
  quantityInCart: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  isOpen: boolean;
  addedNotice: CartAddedNotice | null;
  badgePulse: number;
  openCart: () => void;
  closeCart: () => void;
  dismissNotice: () => void;
  addItem: (product: CartProductInput, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

let memoryItems: CartItem[] | null = null;
const listeners = new Set<() => void>();

function readStoredItems(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return normalizeCartItems(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

function getClientItems(): CartItem[] {
  if (memoryItems === null) {
    memoryItems = readStoredItems();
  }
  return memoryItems;
}

function getServerItems(): CartItem[] {
  return [];
}

function persistItems(items: CartItem[]) {
  memoryItems = items;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota / private mode */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getClientItems, getServerItems);
  const [isOpen, setIsOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState<CartAddedNotice | null>(null);
  const [badgePulse, setBadgePulse] = useState(0);
  const noticeTimer = useRef<number | null>(null);
  const noticeId = useRef(0);

  const openCart = useCallback(() => {
    setIsOpen(true);
    setAddedNotice(null);
  }, []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const dismissNotice = useCallback(() => setAddedNotice(null), []);

  useEffect(() => {
    return () => {
      if (noticeTimer.current != null) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const addItem = useCallback((product: CartProductInput, quantity = 1) => {
    const nextQty = Math.max(1, Math.min(99, Math.floor(quantity)));
    const current = getClientItems();
    const existing = current.find((item) => item.productId === product.productId);
    let quantityInCart = nextQty;

    if (existing) {
      quantityInCart = Math.min(99, existing.quantity + nextQty);
      persistItems(
        current.map((item) =>
          item.productId === product.productId
            ? {
                ...item,
                ...product,
                quantity: quantityInCart,
              }
            : item,
        ),
      );
    } else {
      persistItems([...current, { ...product, quantity: nextQty }]);
    }

    noticeId.current += 1;
    setAddedNotice({
      id: noticeId.current,
      productId: product.productId,
      title: product.title,
      image: product.image,
      quantityInCart,
    });
    setBadgePulse((value) => value + 1);

    if (noticeTimer.current != null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => {
      setAddedNotice(null);
      noticeTimer.current = null;
    }, 3800);
  }, []);

  const removeItem = useCallback((productId: number) => {
    persistItems(getClientItems().filter((item) => item.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    const next = Math.floor(quantity);
    if (next < 1) {
      persistItems(getClientItems().filter((item) => item.productId !== productId));
      return;
    }
    persistItems(
      getClientItems().map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(99, next) }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => persistItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: getCartCount(items),
      isOpen,
      addedNotice,
      badgePulse,
      openCart,
      closeCart,
      dismissNotice,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [
      items,
      isOpen,
      addedNotice,
      badgePulse,
      openCart,
      closeCart,
      dismissNotice,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
