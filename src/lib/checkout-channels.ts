import { buildOrderMessage, type CartItem } from "@/lib/cart";

export type CheckoutChannelId = "vk" | "avito" | "telegram" | "max";

export type CheckoutChannel = {
  id: CheckoutChannelId;
  label: string;
  enabled: boolean;
  order: number;
};

export const SHOP_PHONE_DISPLAY = "+7 922 922-85-88";

const VK_CHAT_URL =
  process.env.NEXT_PUBLIC_VK_CHAT_URL?.trim() || "https://vk.me/appleshop43";

const TELEGRAM_MANAGER_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_MANAGER_URL?.trim() ||
  "https://t.me/appleshop43direct";

/** Optional Avito seller/profile URL. Without it Avito shows only when a cart item has avitoUrl. */
const AVITO_SHOP_URL = process.env.NEXT_PUBLIC_AVITO_SHOP_URL?.trim() || "";

/**
 * Optional MAX invite / profile link («Пригласить по ссылке»).
 * Without it we open MAX share sheet with the order text + phone hint.
 */
const MAX_CHAT_URL = process.env.NEXT_PUBLIC_MAX_CHAT_URL?.trim() || "";

const CHANNELS: CheckoutChannel[] = [
  { id: "vk", label: "ВКонтакте", enabled: true, order: 1 },
  { id: "avito", label: "Авито", enabled: true, order: 2 },
  { id: "telegram", label: "Telegram", enabled: true, order: 3 },
  { id: "max", label: "MAX", enabled: true, order: 4 },
];

export function listCheckoutChannels(items: CartItem[]): CheckoutChannel[] {
  return CHANNELS.filter((channel) => {
    if (!channel.enabled) return false;
    if (channel.id === "avito") return resolveAvitoHref(items) != null;
    return true;
  }).sort((a, b) => a.order - b.order);
}

function resolveAvitoHref(items: CartItem[]): string | null {
  if (items.length === 1 && items[0]?.avitoUrl) return items[0].avitoUrl;
  const withAvito = items.filter((item) => item.avitoUrl);
  if (withAvito.length === 1 && withAvito[0]?.avitoUrl) {
    return withAvito[0].avitoUrl;
  }
  if (AVITO_SHOP_URL) return AVITO_SHOP_URL;
  return null;
}

function telegramHref(message: string): string {
  const base = TELEGRAM_MANAGER_URL.replace(/\/$/, "");
  const encoded = encodeURIComponent(message);
  if (encoded.length > 1800) return base;
  const join = base.includes("?") ? "&" : "?";
  return `${base}${join}text=${encoded}`;
}

function maxHref(message: string): string {
  if (MAX_CHAT_URL) return MAX_CHAT_URL;
  return `https://max.ru/:share?text=${encodeURIComponent(message)}`;
}

export function resolveCheckoutHref(
  channelId: CheckoutChannelId,
  items: CartItem[],
  message: string,
): string | null {
  switch (channelId) {
    case "vk":
      return VK_CHAT_URL;
    case "avito":
      return resolveAvitoHref(items);
    case "telegram":
      return telegramHref(message);
    case "max":
      return maxHref(message);
    default:
      return null;
  }
}

export function channelHint(channelId: CheckoutChannelId): string | null {
  if (channelId === "max" && !MAX_CHAT_URL) {
    return `В MAX найдите нас по номеру ${SHOP_PHONE_DISPLAY}`;
  }
  if (channelId === "avito") {
    return "Откройте объявление и нажмите «Написать»";
  }
  return null;
}

export type CheckoutOpenResult = {
  ok: boolean;
  message: string;
  href: string | null;
  copied: boolean;
};

export async function openCheckoutChannel(
  channelId: CheckoutChannelId,
  items: CartItem[],
): Promise<CheckoutOpenResult> {
  const message = buildOrderMessage(items);
  const href = resolveCheckoutHref(channelId, items, message);
  if (!href) {
    return { ok: false, message, href: null, copied: false };
  }

  let copied = false;
  try {
    await navigator.clipboard.writeText(message);
    copied = true;
  } catch {
    /* private mode / denied */
  }

  window.open(href, "_blank", "noopener,noreferrer");
  return { ok: true, message, href, copied };
}
