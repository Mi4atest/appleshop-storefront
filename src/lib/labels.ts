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

type ProductBadgeOptions = {
  isFreshArrival?: boolean;
};

/** Visual tone for card-corner badges. */
export type ProductBadgeTone = "available" | "on_order" | "fresh";

export type ProductBadge = {
  label: string;
  tone: ProductBadgeTone;
};

/** Badge in card corner: fresh used intake, or availability for factory-new. */
export function getProductBadge(
  product: PublicProduct,
  options?: ProductBadgeOptions,
): ProductBadge | null {
  if (options?.isFreshArrival && product.kind === "used") {
    return { label: "НОВИНКА", tone: "fresh" };
  }
  if (product.kind !== "new") return null;
  if (product.availability_status === "on_order") {
    return { label: "ПОД ЗАКАЗ", tone: "on_order" };
  }
  return { label: "В НАЛИЧИИ", tone: "available" };
}
