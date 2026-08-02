import type { PublicProduct } from "@/lib/api";

export function getKindLabel(kind: PublicProduct["kind"]): string {
  return kind === "used" ? "Б/у" : "Новый";
}

export function getAvailabilityLabel(
  status: string | null | undefined,
): string | null {
  if (status === "on_order") return "Под заказ";
  if (status === "available") return "В наличии";
  if (!status) return null;
  return status;
}

/** Badge in card corner for new items: В наличии / Под заказ */
export function getProductBadge(product: PublicProduct): string | null {
  if (product.kind !== "new") return null;
  if (product.availability_status === "on_order") return "ПОД ЗАКАЗ";
  return "В НАЛИЧИИ";
}
